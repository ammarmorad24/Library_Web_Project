from rest_framework import serializers
from .models import Category, Book

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']
    def to_representation(self, instance):
        return instance.name

class BookSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = '__all__'