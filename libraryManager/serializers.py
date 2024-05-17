from rest_framework import serializers
from .models import Category, Book
from decimal import Decimal

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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        rating = representation.get('rating')
        if rating is not None:
            rating = str(Decimal(rating).normalize())
            representation['rating'] = rating
        return representation