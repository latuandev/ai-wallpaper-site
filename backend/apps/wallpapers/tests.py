from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

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
            image_url="https://example.com/cinematic-mountains.jpg",
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
            image_url="https://example.com/neon-city.jpg",
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
            "https://example.com/cinematic-mountains.jpg",
        )
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
