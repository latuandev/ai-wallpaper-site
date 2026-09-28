from django_filters import rest_framework as filters

from apps.wallpapers.models import Wallpaper


class WallpaperFilter(filters.FilterSet):
    """
    Filter wallpapers by their public metadata fields.
    """

    category = filters.CharFilter(field_name="category__slug")

    class Meta:
        model = Wallpaper
        fields = [
            "category",
            "orientation",
            "quality",
            "width",
            "height",
        ]
