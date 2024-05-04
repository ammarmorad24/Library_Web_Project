from django.contrib import admin
from .models import Book, Category, Review, BorrowedBook

# Register your models here.
admin.site.register([Book, Category, Review, BorrowedBook])
