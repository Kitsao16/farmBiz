# farming/management/commands/create_groups.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from farming.models import Farmer, Business, FarmingActivity
from django.db import transaction


class Command(BaseCommand):
    help = 'Create user groups and assign permissions'

    def handle(self, *args, **kwargs):
        with transaction.atomic():
            if Group.objects.filter(name='Farmers').exists() and \
                    Group.objects.filter(name='Business Owners').exists() and \
                    Group.objects.filter(name='Admins').exists():
                self.stdout.write('Groups already exist. Skipping creation.')
                return

            groups_permissions = {
                'Farmers': {
                    Farmer: ['add', 'change', 'view'],
                    FarmingActivity: ['add', 'change', 'view', 'can_approve_activity'],
                },
                'Business Owners': {
                    Business: ['add', 'change', 'view'],
                    FarmingActivity: ['view'],
                },
                'Admins': {
                    Farmer: ['add', 'change', 'delete', 'view'],
                    Business: ['add', 'change', 'delete', 'view'],
                    FarmingActivity: ['add', 'change', 'delete', 'view', 'can_approve_activity'],
                },
            }

            content_type_cache = {
                Farmer: ContentType.objects.get_for_model(Farmer),
                Business: ContentType.objects.get_for_model(Business),
                FarmingActivity: ContentType.objects.get_for_model(FarmingActivity),
            }

            for group_name, models_permissions in groups_permissions.items():
                group, created = Group.objects.get_or_create(name=group_name)
                if created:
                    self.stdout.write(f'Group "{group_name}" created')
                else:
                    self.stdout.write(f'Group "{group_name}" already exists')

                for model, permissions in models_permissions.items():
                    content_type = content_type_cache[model]
                    for perm in permissions:
                        codename = f'{perm}_{model._meta.model_name}'
                        permission = Permission.objects.get(codename=codename, content_type=content_type)
                        group.permissions.add(permission)
                        self.stdout.write(f'Permission "{codename}" added to group "{group_name}"')
