from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name="register"),
    path('login/', views.signIn, name='login'),
    path('sign-out/', views.signOut, name='sign-out'),
    path('profile/', views.profile, name='profile'),
]
