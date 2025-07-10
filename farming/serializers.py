# farming/serializers.py
from django.contrib.auth.models import User, Group
from django.db.models import Avg
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Business, FarmingActivity, Farmer, Review


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=[('farmer', 'Farmer'), ('business_owner', 'Business Owner')])

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'user_type']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        # Create user
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        # Assign user to group based on user_type
        user_type = validated_data['user_type']
        if user_type == 'farmer':
            group = Group.objects.get(name='Farmers')
        elif user_type == 'business_owner':
            group = Group.objects.get(name='Business Owners')
        else:
            group = Group.objects.get(name='Farmers')  # Default group

        group.user_set.add(user)

        # Create token for the user using SimpleJWT
        refresh = RefreshToken.for_user(user)

        # Return user and token
        return {
            'user': user.username,
            'email': user.email,
            'user_type': user_type,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials.")

    def create(self, validated_data):
        user = validated_data
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user.username,
        }


class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = ['id', 'name', 'location', 'contact_details', 'experience_level', 'specialization', 'farm_size',
                  'farm_type', 'equipment', 'certifications', 'tier']


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'date']


class BusinessSerializer(serializers.ModelSerializer):
    farmer = FarmerSerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = ['id', 'name', 'description', 'contact_info', 'category', 'products_services', 'image', 'farmer',
                  'reviews', 'average_rating']

    @staticmethod
    def get_average_rating(obj):
        return obj.reviews.aggregate(Avg('rating'))['rating__avg']


class FarmingActivitySerializer(serializers.ModelSerializer):
    farmer = FarmerSerializer(read_only=True)

    class Meta:
        model = FarmingActivity
        fields = ['id', 'farmer', 'practice', 'category', 'details', 'input_quantity', 'output_quantity',
                  'weather_conditions', 'image', 'video', 'date', 'block_hash']
        read_only_fields = ['block_hash', 'date']