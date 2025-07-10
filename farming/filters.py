# farming/filters.py
import django_filters
from .models import Business, FarmingActivity


class ActivityFilter(django_filters.FilterSet):
    date = django_filters.DateFromToRangeFilter()
    practice = django_filters.CharFilter(field_name='practice', lookup_expr='icontains')

    class Meta:
        model = FarmingActivity
        fields = ['date', 'practice']


class BusinessFilter(django_filters.FilterSet):
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    services = django_filters.CharFilter(field_name='products_services', lookup_expr='icontains')

    class Meta:
        model = Business
        fields = ['name', 'category', 'location', 'services']
