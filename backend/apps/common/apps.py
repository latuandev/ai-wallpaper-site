from django.apps import AppConfig


class CommonConfig(AppConfig):
    """
    Configure the shared Django application.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.common"
