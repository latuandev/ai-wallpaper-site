from django.contrib import admin

from apps.wallpapers.models import Category, Wallpaper


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Configure category administration.
    """

    list_display = ("name", "slug")
    search_fields = ("name", "slug")


@admin.register(Wallpaper)
class WallpaperAdmin(admin.ModelAdmin):
    """
    Configure wallpaper administration.
    """

    list_display = (
        "title",
        "category",
        "orientation",
        "quality",
        "width",
        "height",
        "created_at",
    )
    list_filter = ("category", "orientation", "quality")
    search_fields = ("title", "slug", "description", "category__name")
