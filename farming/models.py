# farmBiz/farming/models.py

import hashlib
from datetime import datetime

from django.contrib.auth.models import Group, Permission, User
from django.db import models, transaction, IntegrityError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_migrate
from django.dispatch import receiver


class Tier(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, default="")
    benefits = models.TextField(help_text="Benefits of this tier", blank=True, default="")
    requirements = models.TextField(help_text="Requirements to achieve this tier", blank=True, default="")

    def __str__(self):
        return self.name


class Farm(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    size = models.FloatField(validators=[MinValueValidator(0.1)], help_text="Size of the farm in acres")
    farmer = models.ForeignKey('Farmer', on_delete=models.CASCADE, related_name='farms')

    def __str__(self):
        return self.name


class Farmer(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, db_index=True)
    contact_details = models.CharField(max_length=255, default="Not provided")
    experience_level = models.CharField(
        max_length=50,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced')
        ],
        default='beginner'
    )
    specialization = models.CharField(max_length=255, default="General")
    farm_size = models.FloatField(
        help_text="Size of the farm in acres",
        validators=[MinValueValidator(0.1)],
        default=1.0
    )
    farm_type = models.CharField(
        max_length=50,
        choices=[
            ('arable', 'Arable'),
            ('pasture', 'Pasture'),
            ('mixed', 'Mixed')
        ],
        default='arable'
    )
    equipment = models.TextField(help_text="List of equipment available", blank=True, default="Not specified")
    certifications = models.TextField(help_text="List of certifications and licenses", blank=True, default="None")
    tier = models.ForeignKey(Tier, on_delete=models.SET_NULL, null=True, blank=True, help_text="Tier of the farmer")

    def get_full_info(self):
        return {
            "name": self.name,
            "location": self.location,
            "contact_details": self.contact_details,
            "experience_level": self.experience_level,
            "specialization": self.specialization,
            "farm_size": self.farm_size,
            "farm_type": self.farm_type,
            "equipment": self.equipment,
            "certifications": self.certifications,
            "tier": self.tier.name if self.tier else "No Tier"
        }

    def __str__(self):
        return self.name

    class Meta:
        permissions = [
            ("can_approve_activity", "Can approve farming activity"),
        ]


class FarmingActivity(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    practice = models.CharField(max_length=255, db_index=True)
    category = models.CharField(
        max_length=50,
        choices=[
            ('planting', 'Planting'),
            ('harvesting', 'Harvesting'),
            ('livestock_management', 'Livestock Management'),
            ('soil_preparation', 'Soil Preparation'),
        ],
        default='planting',
        db_index=True
    )
    details = models.TextField(help_text="Details of the activity", blank=True, default="")
    input_quantity = models.CharField(max_length=255, blank=True, help_text="E.g., Seeds or fertilizers used",
                                      default="")
    output_quantity = models.CharField(max_length=255, blank=True, help_text="E.g., Crop yield", default="")
    weather_conditions = models.CharField(max_length=255, blank=True, help_text="Weather during the activity",
                                          default="")
    image = models.ImageField(upload_to='activity_images/', blank=True, null=True)
    video = models.FileField(upload_to='activity_videos/', blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    block_hash = models.CharField(max_length=64, blank=True)

    def save(self, *args, **kwargs):
        if not self.block_hash:
            last_activity = FarmingActivity.objects.last()
            previous_hash = last_activity.block_hash if last_activity else 'initial_block'
            block_content = f"{previous_hash}{self.practice}{datetime.utcnow()}"
            self.block_hash = hashlib.sha256(block_content.encode()).hexdigest()
        super(FarmingActivity, self).save(*args, **kwargs)

    def get_full_info(self):
        return {
            "farmer": self.farmer.get_full_info(),
            "practice": self.practice,
            "category": self.category,
            "details": self.details,
            "input_quantity": self.input_quantity,
            "output_quantity": self.output_quantity,
            "weather_conditions": self.weather_conditions,
            "date": self.date,
            "block_hash": self.block_hash
        }

    def __str__(self):
        return f"{self.practice} by {self.farmer.name} on {self.date.strftime('%Y-%m-%d')}"


@receiver(post_migrate)
def create_user_roles(sender, **kwargs):
    # To prevent re-running the code unnecessarily
    if sender.name != 'farming':  # Replace with your actual app name
        return

    groups_permissions = {
        'Farmers': ['add_farmer', 'change_farmer', 'view_farmer'],
        'Business Owners': ['add_business', 'change_business', 'view_business'],
        'Admins': [
            'add_farmer', 'change_farmer', 'delete_farmer', 'view_farmer',
            'add_business', 'change_business', 'delete_business', 'view_business'
        ]
    }

    try:
        with transaction.atomic():
            for group_name, permissions in groups_permissions.items():
                group, created = Group.objects.get_or_create(name=group_name)
                if created:
                    print(f'Group "{group_name}" created')
                else:
                    print(f'Group "{group_name}" already exists')

                # Fetch current permissions for the group
                current_permissions = group.permissions.all()
                current_permission_codenames = [perm.codename for perm in current_permissions]

                for perm in permissions:
                    if perm not in current_permission_codenames:
                        try:
                            permission = Permission.objects.get(codename=perm)
                            group.permissions.add(permission)
                            print(f'Permission "{perm}" added to group "{group_name}"')
                        except Permission.DoesNotExist:
                            print(f'Permission "{perm}" does not exist and could not be added to group "{group_name}"')
                    else:
                        print(f'Permission "{perm}" already exists for group "{group_name}"')
    except IntegrityError:
        print("An error occurred during the creation of user roles.")


class Collaboration(models.Model):
    activity = models.ForeignKey(FarmingActivity, on_delete=models.CASCADE)
    collaborating_farmers = models.ManyToManyField(Farmer, through='CollaborationFarmer')
    notes = models.TextField(help_text="Collaboration notes", blank=True, default="")
    block_hash = models.CharField(max_length=64, blank=True)

    def save(self, *args, **kwargs):
        if not self.block_hash:
            last_collaboration = Collaboration.objects.last()
            previous_hash = last_collaboration.block_hash if last_collaboration else 'initial_block'
            block_content = f"{previous_hash}{self.activity.practice}{datetime.utcnow()}"
            self.block_hash = hashlib.sha256(block_content.encode()).hexdigest()
        super(Collaboration, self).save(*args, **kwargs)

    def __str__(self):
        farmer_names = ', '.join([farmer.name for farmer in self.collaborating_farmers.all()])
        return f"Collaboration on {self.activity.practice} by {farmer_names}"


class CollaborationFarmer(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    collaboration = models.ForeignKey(Collaboration, on_delete=models.CASCADE)
    role = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return f"{self.farmer.name} in {self.collaboration.activity.practice}"


class Business(models.Model):
    CATEGORY_CHOICES = [
        ('farm_produce', 'Farm Produce'),
        ('agritourism', 'Agritourism'),
        ('farm_supplies', 'Farm Supplies'),
        ('services', 'Services'),
    ]
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, unique=True, db_index=True)
    description = models.TextField(blank=True, default="")
    contact_info = models.CharField(max_length=255, blank=True, default="Not provided")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='farm_produce', db_index=True)
    products_services = models.TextField(help_text="Details of the products or services offered", blank=True,
                                         default="")
    image = models.ImageField(upload_to='business_images/', blank=True, null=True)

    def get_full_info(self):
        return {
            "name": self.name,
            "description": self.description,
            "contact_info": self.contact_info,
            "category": self.category,
            "products_services": self.products_services
        }

    def __str__(self):
        return self.name


class Product(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    availability = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True, default="")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.business.name}"


class Incentive(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    points = models.PositiveIntegerField(default=0)
    redeemed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.farmer.name} - {self.points} points"
