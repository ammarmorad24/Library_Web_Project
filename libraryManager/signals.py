from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
import os
from .models import Book

@receiver(pre_delete, sender=Book)
def delete_cover_on_delete(sender, instance, **kwargs):
    if instance.cover:
        if instance.cover.name != 'covers/fake_cover.jpg' and os.path.isfile(instance.cover.path):
            os.remove(instance.cover.path)


@receiver(pre_save, sender=Book)
def delete_cover_on_update(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_cover = Book.objects.get(pk=instance.pk).cover
    except Book.DoesNotExist:
        return False

    new_cover = instance.cover
    if old_cover != new_cover and old_cover.name != 'covers/fake_cover.jpg':
        if os.path.isfile(old_cover.path):
            os.remove(old_cover.path)
