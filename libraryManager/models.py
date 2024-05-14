from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from datetime import date, timedelta

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    rating = models.DecimalField(max_digits=3, decimal_places=2, validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    story = models.TextField()
    categories = models.ManyToManyField(Category, blank=True)
    dateAdded = models.DateTimeField(auto_now_add=True)
    datePublished = models.DateField()
    cover = models.ImageField(upload_to='covers/')
    isAvailable = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    review = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    dateAdded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} reviewed {self.book}"

def make_return_date():
    return date.today() + timedelta(days=30)

class BorrowedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    returnDate = models.DateTimeField(default=make_return_date)

    def __str__(self):
        return f"{self.user} borrowed {self.book}"