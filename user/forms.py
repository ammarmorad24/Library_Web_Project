# forms.py
from django.contrib.auth.forms import UserCreationForm , AuthenticationForm
from django import forms
from django.contrib.auth.models import User

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.TextInput(attrs={ 'placeholder': 'email'}))
    username = forms.CharField(required=True, widget=forms.TextInput(attrs={ 'placeholder': 'username'}))
    password1 = forms.CharField(required=True, widget=forms.PasswordInput(attrs={ 'placeholder': 'password'}))
    password2 = forms.CharField(required=True, widget=forms.PasswordInput(attrs={ 'placeholder': 'confirm password'}))
    is_superuser = forms.BooleanField(label="You are an admin? ", required=False, widget=forms.CheckboxInput())

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'is_superuser')

class LoginForm(AuthenticationForm):
    
    username = forms.CharField(required=True, widget=forms.TextInput(attrs={ 'placeholder': 'username'}))
    password = forms.CharField(required=True, widget=forms.PasswordInput(attrs={ 'placeholder': 'password'}))
    error_messages = {
        'invalid_login': "Please enter a correct username and password.",
    }
    

    class Meta:
        model = User
        fields = ('username', 'password')