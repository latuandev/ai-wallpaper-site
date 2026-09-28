from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

from apps.wallpapers.models import Category, Wallpaper
from apps.wallpapers.seed_data import WALLPAPER_SEED_DATA


class Command(BaseCommand):
    """
    Seed demo categories and wallpapers through deterministic slug upserts.
    """

    help = "Seed the demo wallpaper dataset."

    @transaction.atomic
    def handle(self, *args: object, **options: object) -> None:
        """
        Upsert every demo category and wallpaper in one transaction.
        """
        category_names: dict[str, str] = {}

        for wallpaper_data in WALLPAPER_SEED_DATA:
            category_name = wallpaper_data["category"]
            category_slug = slugify(category_name)
            existing_name = category_names.get(category_slug)
            if existing_name is not None and existing_name != category_name:
                raise CommandError("Category names produce the same slug.")
            category_names[category_slug] = category_name

        categories: dict[str, Category] = {}
        categories_created = 0
        categories_reused = 0

        for category_slug, category_name in category_names.items():
            category, created = Category.objects.update_or_create(
                slug=category_slug,
                defaults={"name": category_name},
            )
            categories[category_slug] = category
            if created:
                categories_created += 1
            else:
                categories_reused += 1

        wallpapers_created = 0
        wallpapers_updated = 0

        for wallpaper_data in WALLPAPER_SEED_DATA:
            category_slug = slugify(wallpaper_data["category"])
            _, created = Wallpaper.objects.update_or_create(
                slug=wallpaper_data["slug"],
                defaults={
                    "title": wallpaper_data["title"],
                    "description": wallpaper_data.get("description", ""),
                    "category": categories[category_slug],
                    "width": wallpaper_data["width"],
                    "height": wallpaper_data["height"],
                    "quality": wallpaper_data["quality"],
                    "orientation": wallpaper_data["orientation"],
                    "aspect_ratio": wallpaper_data["aspect_ratio"],
                    "image_url": wallpaper_data["image_url"],
                },
            )
            if created:
                wallpapers_created += 1
            else:
                wallpapers_updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Categories created: {categories_created}; "
                f"categories updated or reused: {categories_reused}; "
                f"wallpapers created: {wallpapers_created}; "
                f"wallpapers updated: {wallpapers_updated}."
            )
        )
