from django.shortcuts import render
from .models import Book

# Create your views here.
def home(request):
    return render(request, 'home.html')

def bookDetails(request, book_id):
    book = Book.objects.get(id=book_id)
    return render(request, 'book-page.html', {'book': book})

def addBook(request):
    
    return render(request, 'add-book.html')

def editBook(request, book_id):
    book = Book.objects.get(id=book_id)
    return render(request, 'edit-book.html', {'book': book})


def deleteBook(request, book_id):
    book = Book.objects.get(id=book_id)
    book.delete()
    return render(request, 'delete-book.html', {'book': book})
