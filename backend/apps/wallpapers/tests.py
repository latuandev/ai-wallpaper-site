from io import StringIO
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from django.core.management import call_command
from django.core.management.base import CommandError
from django.db import IntegrityError
from django.test import TestCase, override_settings
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase

from apps.wallpapers.data.seed_data import WALLPAPER_SEED_DATA
from apps.wallpapers.management.commands.seed_wallpapers import (
    derive_wallpaper_title,
)
from apps.wallpapers.models import Category, Wallpaper
from common.constants import Orientation


class WallpaperApiTests(APITestCase):
    """
    Verify wallpaper list, detail, querying, and representation behavior.
    """

    @classmethod
    def setUpTestData(cls) -> None:
        """
        Create a small explicit dataset shared by the API tests.
        """
        cls.nature = Category.objects.create(name="Nature", slug="nature")
        cls.anime = Category.objects.create(name="Anime", slug="anime")
        cls.mountains = Wallpaper.objects.create(
            title="Cinematic Mountains",
            slug="cinematic-mountains",
            description="Snow-covered peaks at sunrise.",
            category=cls.nature,
            width=3840,
            height=2160,
            orientation=Orientation.LANDSCAPE.value,
            aspect_ratio="16:9",
            quality="4K",
            image="wallpapers/cinematic-mountains.jpg",
        )
        cls.city = Wallpaper.objects.create(
            title="Neon City",
            slug="neon-city",
            description="An animated city after dark.",
            category=cls.anime,
            width=1440,
            height=2560,
            orientation=Orientation.PORTRAIT.value,
            aspect_ratio="9:16",
            quality="2K",
            image="wallpapers/neon-city.jpg",
        )

    def test_list_returns_ok(self) -> None:
        """
        Return wallpapers from the list endpoint.
        """
        response = self.client.get(reverse("wallpaper-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_detail_uses_slug(self) -> None:
        """
        Resolve wallpaper detail records by slug.
        """
        response = self.client.get(
            reverse("wallpaper-detail", kwargs={"slug": self.mountains.slug})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], self.mountains.slug)

    def test_unknown_slug_returns_not_found(self) -> None:
        """
        Return not found for an unknown wallpaper slug.
        """
        response = self.client.get(
            reverse("wallpaper-detail", kwargs={"slug": "unknown"})
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_category_filter_uses_slug(self) -> None:
        """
        Filter wallpapers by public category slug.
        """
        response = self.client.get(reverse("wallpaper-list"), {"category": "anime"})

        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["slug"], self.city.slug)

    def test_orientation_filter(self) -> None:
        """
        Filter wallpapers by orientation value.
        """
        response = self.client.get(
            reverse("wallpaper-list"),
            {"orientation": Orientation.LANDSCAPE.value},
        )

        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["slug"], self.mountains.slug)

    def test_search_by_title(self) -> None:
        """
        Search wallpapers by title.
        """
        response = self.client.get(reverse("wallpaper-list"), {"search": "mountain"})

        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["slug"], self.mountains.slug)

    def test_search_by_category_name(self) -> None:
        """
        Search wallpapers by category name.
        """
        response = self.client.get(reverse("wallpaper-list"), {"search": "anime"})

        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["slug"], self.city.slug)

    def test_ordering_by_title(self) -> None:
        """
        Order wallpapers by a supported field.
        """
        response = self.client.get(reverse("wallpaper-list"), {"ordering": "title"})

        titles = [wallpaper["title"] for wallpaper in response.data["results"]]
        self.assertEqual(titles, ["Cinematic Mountains", "Neon City"])

    def test_response_uses_camel_case_fields(self) -> None:
        """
        Expose explicitly mapped camel-case API fields.
        """
        response = self.client.get(
            reverse("wallpaper-detail", kwargs={"slug": self.mountains.slug})
        )

        self.assertEqual(response.data["aspectRatio"], "16:9")
        self.assertEqual(
            response.data["imageUrl"],
            "http://testserver/media/wallpapers/cinematic-mountains.jpg",
        )
        self.assertNotIn("unsplash.com", response.data["imageUrl"])
        self.assertIn("createdAt", response.data)
        self.assertIn("updatedAt", response.data)

    def test_category_is_represented_by_name(self) -> None:
        """
        Represent a wallpaper category by its human-readable name.
        """
        response = self.client.get(
            reverse("wallpaper-detail", kwargs={"slug": self.mountains.slug})
        )

        self.assertEqual(response.data["category"], "Nature")

    def test_list_is_paginated(self) -> None:
        """
        Use the project-wide page-number pagination response shape.
        """
        response = self.client.get(reverse("wallpaper-list"))

        self.assertEqual(response.data["count"], 2)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertEqual(len(response.data["results"]), 2)

    def test_write_methods_are_not_allowed(self) -> None:
        """
        Reject create, update, partial-update, and delete requests.
        """
        list_url = reverse("wallpaper-list")
        detail_url = reverse(
            "wallpaper-detail",
            kwargs={"slug": self.mountains.slug},
        )
        requests = [
            ("post", list_url),
            ("put", detail_url),
            ("patch", detail_url),
            ("delete", detail_url),
        ]

        for method, url in requests:
            with self.subTest(method=method):
                response = getattr(self.client, method)(url, {}, format="json")
                self.assertEqual(
                    response.status_code,
                    status.HTTP_405_METHOD_NOT_ALLOWED,
                )


class WallpaperSeedCommandTests(TestCase):
    """
    Verify deterministic and atomic demo wallpaper seeding.
    """

    def setUp(self) -> None:
        """
        Isolate seed sources and runtime media in temporary directories.
        """
        super().setUp()
        self.seed_image_directory = TemporaryDirectory()
        self.addCleanup(self.seed_image_directory.cleanup)
        self.seed_image_path = Path(self.seed_image_directory.name)
        for image_filename in {
            wallpaper_data["image_filename"] for wallpaper_data in WALLPAPER_SEED_DATA
        }:
            self.create_seed_image(image_filename)
        self.seed_image_patch = patch(
            "apps.wallpapers.management.commands.seed_wallpapers.SEED_IMAGE_DIR",
            self.seed_image_path,
        )
        self.seed_image_patch.start()
        self.addCleanup(self.seed_image_patch.stop)

        self.media_directory = TemporaryDirectory()
        self.addCleanup(self.media_directory.cleanup)
        self.media_settings = override_settings(
            MEDIA_ROOT=self.media_directory.name,
        )
        self.media_settings.enable()
        self.addCleanup(self.media_settings.disable)

    def create_seed_image(self, image_filename: str) -> None:
        """
        Create a valid temporary image for a seed filename.
        """
        image_format = "PNG" if Path(image_filename).suffix == ".png" else "JPEG"
        Image.new("RGB", (1, 1), color="white").save(
            self.seed_image_path / image_filename,
            format=image_format,
        )

    @staticmethod
    def run_seed() -> str:
        """
        Run the seed command and return its console output.
        """
        output = StringIO()
        call_command("seed_wallpapers", stdout=output)
        return output.getvalue()

    def test_first_run_creates_expected_categories(self) -> None:
        """
        Create every category represented by the demo dataset.
        """
        output = self.run_seed()

        self.assertEqual(Category.objects.count(), 10)
        self.assertIn("Categories created: 10", output)

    def test_first_run_creates_expected_wallpapers(self) -> None:
        """
        Create every wallpaper represented by the demo dataset.
        """
        output = self.run_seed()

        self.assertEqual(Wallpaper.objects.count(), 25)
        self.assertIn("wallpapers created: 25", output)

    def test_first_run_stores_images_in_media_storage(self) -> None:
        """
        Copy seed source images into Django media storage.
        """
        self.run_seed()

        wallpaper = Wallpaper.objects.get(slug="cinematic-mountains")
        stored_image = Path(self.media_directory.name) / wallpaper.image.name
        self.assertEqual(
            wallpaper.image.name,
            "wallpapers/cinematic-mountains.jpg",
        )
        self.assertTrue(stored_image.is_file())

    def test_title_is_derived_from_image_filename(self) -> None:
        """
        Convert lowercase kebab-case image stems into wallpaper titles.
        """
        self.assertEqual(derive_wallpaper_title("fly-bird.png"), "Fly Bird")
        self.assertEqual(
            derive_wallpaper_title("cinematic-mountains.jpg"),
            "Cinematic Mountains",
        )
        self.assertEqual(
            derive_wallpaper_title("city-night-4k.webp"),
            "City Night 4k",
        )

    def test_seed_stores_filename_derived_title(self) -> None:
        """
        Persist a title derived from the seed image filename.
        """
        image_filename = "fly-bird.png"
        self.create_seed_image(image_filename)
        seed_data = (
            {
                **WALLPAPER_SEED_DATA[0],
                "slug": "fly-bird",
                "image_filename": image_filename,
            },
        )

        with patch(
            "apps.wallpapers.management.commands.seed_wallpapers.WALLPAPER_SEED_DATA",
            seed_data,
        ):
            self.run_seed()

        wallpaper = Wallpaper.objects.get(slug="fly-bird")
        self.assertEqual(wallpaper.title, "Fly Bird")

    def test_second_run_does_not_duplicate_wallpapers(self) -> None:
        """
        Reuse wallpaper slugs on subsequent seed runs.
        """
        self.run_seed()
        self.run_seed()

        self.assertEqual(Wallpaper.objects.count(), 25)

    def test_second_run_does_not_duplicate_categories(self) -> None:
        """
        Reuse category slugs on subsequent seed runs.
        """
        self.run_seed()
        self.run_seed()

        self.assertEqual(Category.objects.count(), 10)

    def test_second_run_does_not_duplicate_media_files(self) -> None:
        """
        Replace deterministic image names without creating suffixed copies.
        """
        media_root = Path(self.media_directory.name)
        self.run_seed()
        first_run_files = sorted(
            path.relative_to(media_root)
            for path in media_root.rglob("*")
            if path.is_file()
        )

        self.run_seed()
        second_run_files = sorted(
            path.relative_to(media_root)
            for path in media_root.rglob("*")
            if path.is_file()
        )

        self.assertEqual(len(second_run_files), 25)
        self.assertEqual(second_run_files, first_run_files)

    def test_existing_wallpaper_is_updated(self) -> None:
        """
        Restore the filename-derived title for an existing wallpaper slug.
        """
        self.run_seed()
        wallpaper = Wallpaper.objects.get(slug="cinematic-mountains")
        wallpaper.title = "Outdated title"
        wallpaper.save(update_fields=["title"])

        self.run_seed()

        wallpaper.refresh_from_db()
        self.assertEqual(wallpaper.title, "Cinematic Mountains")

    def test_category_relationships_are_correct(self) -> None:
        """
        Associate each seeded wallpaper with its source category.
        """
        self.run_seed()

        wallpaper = Wallpaper.objects.select_related("category").get(slug="neon-city")
        self.assertEqual(wallpaper.category.name, "Cyberpunk")
        self.assertEqual(wallpaper.category.slug, "cyberpunk")

    def test_representative_metadata_matches_frontend_data(self) -> None:
        """
        Preserve factual metadata from the frontend demo source.
        """
        self.run_seed()

        wallpaper = Wallpaper.objects.get(slug="cinematic-mountains")
        self.assertEqual(wallpaper.title, "Cinematic Mountains")
        self.assertEqual(
            wallpaper.description,
            "Breathtaking landscapes from around the world. "
            "Let nature inspire your screen.",
        )
        self.assertEqual(wallpaper.width, 3840)
        self.assertEqual(wallpaper.height, 2160)
        self.assertEqual(wallpaper.quality, "4K")
        self.assertEqual(wallpaper.orientation, "landscape")
        self.assertEqual(wallpaper.aspect_ratio, "16:9")
        self.assertEqual(wallpaper.image.name, "wallpapers/cinematic-mountains.jpg")

    def test_missing_seed_image_fails_clearly(self) -> None:
        """
        Reject seed data that references a missing source image.
        """
        missing_image_filename = WALLPAPER_SEED_DATA[0]["image_filename"]
        missing_image_path = (
            Path(self.seed_image_directory.name) / missing_image_filename
        )
        missing_image_path.unlink()

        with self.assertRaisesMessage(
            CommandError,
            f"Seed image file does not exist: {missing_image_filename}.",
        ):
            self.run_seed()

        self.assertFalse(Category.objects.exists())
        self.assertFalse(Wallpaper.objects.exists())

    def test_invalid_seed_image_filenames_fail_before_mutation(self) -> None:
        """
        Reject invalid filename forms without creating database or media state.
        """
        invalid_filenames = (
            "Fly-Bird.png",
            "fly_bird.png",
            "fly bird.png",
            "fly--bird.png",
        )

        for image_filename in invalid_filenames:
            with self.subTest(image_filename=image_filename):
                seed_data = (
                    {
                        **WALLPAPER_SEED_DATA[0],
                        "image_filename": image_filename,
                    },
                )
                with patch(
                    "apps.wallpapers.management.commands.seed_wallpapers.WALLPAPER_SEED_DATA",
                    seed_data,
                ):
                    with self.assertRaisesMessage(
                        CommandError,
                        f"Invalid seed image filename: {image_filename}.",
                    ):
                        self.run_seed()

                self.assertFalse(Category.objects.exists())
                self.assertFalse(Wallpaper.objects.exists())
                self.assertFalse(
                    any(
                        path.is_file()
                        for path in Path(self.media_directory.name).rglob("*")
                    )
                )

    def test_failed_seed_rolls_back_all_changes(self) -> None:
        """
        Roll back database upserts and remove new media after failure.
        """
        invalid_seed_data = (
            {
                "slug": "rollback-valid",
                "category": "Rollback One",
                "width": 1920,
                "height": 1080,
                "quality": "FHD",
                "orientation": "landscape",
                "aspect_ratio": "16:9",
                "image_filename": "cinematic-mountains.jpg",
            },
            {
                "slug": "rollback-invalid",
                "category": "Rollback Two",
                "width": 0,
                "height": 1080,
                "quality": "FHD",
                "orientation": "landscape",
                "aspect_ratio": "16:9",
                "image_filename": "sunset-peaks.jpg",
            },
        )

        with patch(
            "apps.wallpapers.management.commands.seed_wallpapers.WALLPAPER_SEED_DATA",
            invalid_seed_data,
        ):
            with self.assertRaises(IntegrityError):
                self.run_seed()

        self.assertFalse(Category.objects.exists())
        self.assertFalse(Wallpaper.objects.exists())
        self.assertFalse(
            any(path.is_file() for path in Path(self.media_directory.name).rglob("*"))
        )

    def test_failed_reseed_restores_existing_media(self) -> None:
        """
        Restore pre-run media content when a reseed fails.
        """
        self.run_seed()
        existing_image = (
            Path(self.media_directory.name) / "wallpapers" / "cinematic-mountains.jpg"
        )
        previous_content = b"Previously valid runtime image."
        existing_image.write_bytes(previous_content)
        invalid_seed_data = (
            {
                **WALLPAPER_SEED_DATA[0],
            },
            {
                **WALLPAPER_SEED_DATA[1],
                "width": 0,
            },
        )

        with patch(
            "apps.wallpapers.management.commands.seed_wallpapers.WALLPAPER_SEED_DATA",
            invalid_seed_data,
        ):
            with self.assertRaises(IntegrityError):
                self.run_seed()

        self.assertEqual(Category.objects.count(), 10)
        self.assertEqual(Wallpaper.objects.count(), 25)
        self.assertEqual(existing_image.read_bytes(), previous_content)
