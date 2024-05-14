from faker import Faker
import random
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library.settings')
django.setup()

from libraryManager.models import Book, Category
fake = Faker()

categories = ["adventure", "horror", "fantasy", "mystery", "philosophy", "self-help"]
for category in categories:
    Category.objects.create(name=category)

# Function to create fake book data
def create_fake_books(num_books):
    for _ in range(num_books):
        title = fake.sentence(nb_words=3)
        author = fake.name()
        rating = round(random.uniform(1.0, 5.0), 2)
        story = fake.paragraph()
        date_published = fake.date_between(start_date='-10y', end_date='today')
        cover = "covers/fake_cover.jpg"
        isAvailable = random.choice([True, False])

        book = Book.objects.create(
            title=title,
            author=author,
            rating=rating,
            story=story,
            datePublished=date_published,
            cover=cover,
            isAvailable=isAvailable
        )

        # Add random categories to the book
        categories = Category.objects.order_by('?')[:random.randint(1, 3)]
        for category in categories:
            book.categories.add(category)

# Usage: Call create_fake_books function with the number of fake books you want to create
create_fake_books(50)  # Create 50 fake books
