from django.core.validators import MinValueValidator
from django.db import models

from common.constants import Orientation


class Category(models.Model):
    """
    Represent a category used to organize wallpapers.
    """

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "categories"

    def __str__(self) -> str:
        """
        Return the category name.
        """
        return self.name


class Wallpaper(models.Model):
    """
    Represent a wallpaper asset and its factual source metadata.
    """

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="wallpapers",
    )
    width = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    height = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    orientation = models.CharField(max_length=9, choices=Orientation.choices())
    aspect_ratio = models.CharField(max_length=20)
    quality = models.CharField(max_length=20)
    image_url = models.URLField(max_length=2048)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(width__gt=0),
                name="wallpaper_width_positive",
            ),
            models.CheckConstraint(
                condition=models.Q(height__gt=0),
                name="wallpaper_height_positive",
            ),
        ]

    def __str__(self) -> str:
        """
        Return the wallpaper title.
        """
        return self.title
