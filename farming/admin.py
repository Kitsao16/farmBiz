from django.contrib import admin
from .models import Farmer, FarmingActivity, Collaboration, Business, Incentive, Tier


class FarmingActivityInline(admin.TabularInline):
    model = FarmingActivity
    extra = 1


@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'experience_level', 'specialization', 'farm_size', 'farm_type')
    search_fields = ('name', 'location', 'specialization')
    list_filter = ('experience_level', 'farm_type')
    inlines = [FarmingActivityInline]


@admin.register(FarmingActivity)
class FarmingActivityAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'practice', 'category', 'date', 'block_hash')
    search_fields = ('farmer__name', 'practice', 'category')
    list_filter = ('category', 'date', 'farmer')
    date_hierarchy = 'date'


@admin.register(Collaboration)
class CollaborationAdmin(admin.ModelAdmin):
    list_display = ('activity', 'get_farmers', 'notes')
    search_fields = ('activity__practice', 'farmers__name')
    list_filter = ('activity',)

    def get_farmers(self, obj):
        return ', '.join([farmer.name for farmer in obj.farmers.all()])

    get_farmers.short_description = 'Farmers'


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('name', 'farmer', 'contact_info')
    search_fields = ('name', 'farmer__name')
    list_filter = ('farmer',)


@admin.register(Incentive)
class IncentiveAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'points', 'redeemed')
    list_filter = ('redeemed',)
    search_fields = ('farmer__name',)


@admin.register(Tier)
class TierAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
