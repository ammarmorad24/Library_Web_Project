from django.shortcuts import render , redirect
from .models import Book, Category , BorrowedBook, Review
from .serializers import BookSerializer
from rest_framework import generics, filters, pagination
from django_filters.rest_framework import DjangoFilterBackend
from .forms import ReviewForm

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
    reviews = Review.objects.filter(book=book)
    data = {'book': book, 'reviews': reviews}
    return render(request, 'book-page.html', data)

def addBook(request):
    if request.method == "POST":
        title = request.POST.get('title')
        author = request.POST.get('author')
        date_published = request.POST.get('date-published')
        rating = request.POST.get('rating')
        categories = request.POST.getlist("options")
        desc = request.POST.get('description')
        image = request.POST.get('cover')
        book = Book.objects.create(title=title, author = author, datePublished = date_published, rating=rating, cover = image, story = desc)
        for category_name in categories:
            category, created = Category.objects.get_or_create(name=category_name)
            book.categories.add(category)
        book.save()
        return redirect(home)
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

def borrowBooksList(request):
    borrowedBooks = BorrowedBook.objects.filter(user=request.user).order_by('returnDate')
    return render(request, 'borrowed-books.html', {'borrowedBooks': borrowedBooks})

def returnBook(request, borrowed_book_id):
    borrowedBook = BorrowedBook.objects.get(id=borrowed_book_id)
    borrowedBook.book.isAvailable = True
    borrowedBook.book.save()
    borrowedBook.delete()
    return redirect('/borrowed-books/')

def review(request, book_id):
    book = Book.objects.get(id=book_id)
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.book = book
            review.user = request.user
            review.save()
            return redirect(f'/book/{book_id}/') 
    else:
        form = ReviewForm()
    data = {'book': book, 'form': form}
    return render(request, 'review-book.html', data)
