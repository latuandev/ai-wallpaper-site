from rest_framework import serializers

from apps.wallpapers.models import Category, Wallpaper


class WallpaperSerializer(serializers.ModelSerializer):
    """
    Validate wallpapers and expose their frontend-facing representation.
    """

    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
    )
    aspectRatio = serializers.CharField(source="aspect_ratio")
    imageUrl = serializers.URLField(source="image_url")
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Wallpaper
        fields = [
            "id",
            "slug",
            "title",
            "description",
            "category",
            "width",
            "height",
            "quality",
            "orientation",
            "aspectRatio",
            "imageUrl",
            "createdAt",
            "updatedAt",
        ]

    def to_representation(self, instance: Wallpaper) -> dict[str, object]:
        """
        Represent the wallpaper category by name instead of primary key.
        """
        representation = super().to_representation(instance)
        representation["category"] = instance.category.name
        return representation
