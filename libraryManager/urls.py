from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name="home"),
    path('book/<int:book_id>/', views.bookDetails),  
    path('add-book/', views.addBook),
    path('edit-book/<int:book_id>/', views.editBook),
    path('delete-book/<int:book_id>/', views.deleteBook),
    
]