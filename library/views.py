# from django.http import HttpResponse
from django.shortcuts import render


def landingPage(request):
    return render(request, 'index.html')

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')

def register(request):
    return render(request, 'register.html')

def signIn(request):
    return render(request, 'sign-in.html')