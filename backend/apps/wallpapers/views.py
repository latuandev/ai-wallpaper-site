import mimetypes
from pathlib import Path

from django_filters.rest_framework import DjangoFilterBackend
from django.http import FileResponse
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.request import Request
from rest_framework.viewsets import ModelViewSet

from apps.wallpapers.filters import WallpaperFilter
from apps.wallpapers.models import Wallpaper
from apps.wallpapers.serializers import WallpaperSerializer
from common.messages import MESSAGES


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

    @action(detail=True, methods=["get"])
    def download(
        self,
        _request: Request,
        *args: object,
        **kwargs: object,
    ) -> FileResponse:
        """
        Stream the stored wallpaper image as a deterministic attachment.
        """
        wallpaper = self.get_object()
        filename = Path(wallpaper.image.name).name
        content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"

        try:
            image_file = wallpaper.image.open("rb")
        except OSError as error:
            raise NotFound(MESSAGES["wallpapers"]["image_unavailable"]) from error

        return FileResponse(
            image_file,
            as_attachment=True,
            filename=filename,
            content_type=content_type,
        )
