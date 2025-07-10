from django.shortcuts import get_object_or_404
from .models import Farmer, Business
import requests
from django.conf import settings


def get_farmer_from_request(data):
    farmer_id = data.get('farmer_id')
    return get_object_or_404(Farmer, id=farmer_id)


def get_business_from_request(data):
    business_id = data.get('business_id')
    return get_object_or_404(Business, id=business_id)


def get_weather(location):
    api_key = settings.OPENWEATHERMAP_API_KEY
    response = requests.get(f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}")
    if response.status_code == 200:
        data = response.json()
        return data['weather'][0]['description']
    return 'Weather data not available'
