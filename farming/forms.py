# farming/forms.py

from django import forms
from .models import Farm
from django.contrib.auth.models import User


USER_TYPE_CHOICES = [
    ('farmer', 'Farmer'),
    ('business_owner', 'Business Owner'),
]


class RegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(widget=forms.PasswordInput, label="Confirm Password")
    user_type = forms.ChoiceField(choices=USER_TYPE_CHOICES, label="User Type")

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'user_type']

    def clean_password_confirm(self):
        password = self.cleaned_data.get('password')
        password_confirm = self.cleaned_data.get('password_confirm')
        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError("Passwords do not match")
        return password_confirm


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)


class FarmForm(forms.ModelForm):
    class Meta:
        model = Farm
        fields = '__all__'

    def clean_farm_size(self):
        farm_size = self.cleaned_data['farm_size']
        if farm_size <= 0:
            raise forms.ValidationError("Farm size must be greater than zero.")
        return farm_size
