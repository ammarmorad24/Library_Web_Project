from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name="home"),
    path('search/', views.search),
    path('book/<int:book_id>/', views.bookDetails), 
    path('borrow/<int:book_id>/', views.borrowBook), 
    path('add-book/', views.addBook),
    path('edit-book/<int:book_id>/', views.editBook),
    path('delete/<int:book_id>/', views.deleteBook),
    path('return/<int:borrowed_book_id>/', views.returnBook),
    path('api/books/', views.BookList.as_view()),
    path('review/<int:book_id>/', views.review),
    path('borrowed-books/', views.borrowBooksList),
]