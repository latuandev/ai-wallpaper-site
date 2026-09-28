from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.viewsets import ModelViewSet

from apps.wallpapers.filters import WallpaperFilter
from apps.wallpapers.models import Wallpaper
from apps.wallpapers.serializers import WallpaperSerializer


class WallpaperViewSet(ModelViewSet):
    """
    Expose read-only wallpaper resources using slug detail lookup.
    """

    queryset = Wallpaper.objects.select_related("category").all()
    serializer_class = WallpaperSerializer
    http_method_names = ["get", "head", "options"]
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = WallpaperFilter
    search_fields = ["title", "description", "category__name"]
    ordering_fields = ["created_at", "updated_at", "title", "width", "height"]
    ordering = ["-created_at"]
