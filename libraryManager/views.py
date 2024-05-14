from django.shortcuts import render , redirect
from django.http import JsonResponse
from .models import Book, Category , BorrowedBook
from .serializers import BookSerializer
from rest_framework import generics, filters, pagination
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.
class DynamicSearchFilter(filters.SearchFilter):
    def get_search_fields(self, view, request):
        search_by = request.query_params.get('search_by')
        if search_by:
            return [search_by]
        return getattr(view, 'search_fields', None)

class BookList(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.OrderingFilter, DynamicSearchFilter, DjangoFilterBackend]
    ordering_fields = ['title', 'rating', 'dateAdded', 'datePublished']
    search_fields = ['title', 'author', 'categories__name']
    filterset_fields = ['isAvailable', 'categories__name']
    pagination_class = pagination.PageNumberPagination
    pagination_class.page_size = 21


def home(request):
    categories = Category.objects.all()
    return render(request, 'home.html', {'categories': categories})

def search(request):
    categories = Category.objects.all()
    return render(request, 'search-results.html', {'categories': categories})

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
    return redirect('/home')

def borrowBook(request, book_id):
    book = Book.objects.get(id=book_id)
    book.isAvailable = False
    book.save()
    BorrowedBook.objects.create(book=book, user=request.user)
    return redirect(f'/book/{book_id}/')
