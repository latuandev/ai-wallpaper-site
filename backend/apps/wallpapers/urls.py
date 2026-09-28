from rest_framework.routers import DefaultRouter

from apps.wallpapers.views import WallpaperViewSet


router = DefaultRouter()
router.register("", WallpaperViewSet, basename="wallpaper")

urlpatterns = router.urls
