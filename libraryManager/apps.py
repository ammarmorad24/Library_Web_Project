from django.apps import AppConfig


class LibrarymanagerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'libraryManager'

    def ready(self):
        import libraryManager.signals