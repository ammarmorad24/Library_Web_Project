from django.shortcuts import render
from .models import Book, Category
from django.db.models import F
from rest_framework import generics
from rest_framework import filters
from .serializers import BookSerializer
from rest_framework.pagination import PageNumberPagination

# Create your views here.
class BookList(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['title', 'rating', 'dateAdded', 'datePublished']
    search_fields = ['title', 'author']
    pagination_class = PageNumberPagination
    pagination_class.page_size = 21

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(categories__name=category)

        if self.request.query_params.get('available_only', None):
            queryset = queryset.filter(numBorrowedCopies__lt=F('numCopies'))
        return queryset


def home(request):
    categories = Category.objects.all()
    return render(request, 'home.html', {'categories': categories})

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
