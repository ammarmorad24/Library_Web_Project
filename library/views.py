# from django.http import HttpResponse
from django.shortcuts import render
from .models import Book


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

def bookDetails(request, book_id):
    book = Book.objects.get(id=book_id)
    return render(request, 'book-page.html', {'book_id': book_id})

def addBook(request):
    return render(request, 'add-book.html')

def editBook(request, book_id):
    book = Book.objects.get(id=book_id)
    return render(request, 'edit-book.html', {'book': book})


def deleteBook(request, book_id):
    book = Book.objects.get(id=book_id)
    book.delete()
    return render(request, 'delete-book.html', {'book': book})

