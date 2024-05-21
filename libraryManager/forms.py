from django import forms
from .models import Review

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'review']
        widgets = {
            'rating': forms.NumberInput(attrs={
                'id': 'score',
                'class': 'input1',
                'placeholder': 'Score: 1-5',
                'step': 'any',
                'min': '1',
                'max': '5',
                'required': True,
            }),
            'review': forms.Textarea(attrs={
                'id': 'review-content',
                'rows': '5',
                'cols': '50',
                'class': 'input2',
                'placeholder': 'Type what you think about the book...',
                'minlength': '1',
                'required': True,
            }),
        }
