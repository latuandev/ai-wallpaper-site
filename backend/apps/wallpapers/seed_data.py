from typing import NotRequired, TypedDict


class WallpaperSeedItem(TypedDict):
    """
    Describe one wallpaper mirrored from the frontend demo dataset.
    """

    slug: str
    title: str
    description: NotRequired[str]
    category: str
    width: int
    height: int
    quality: str
    orientation: str
    aspect_ratio: str
    image_url: str


# This dataset mirrors frontend/data/wallpapers.ts for backend demo seeding.
WALLPAPER_SEED_DATA: tuple[WallpaperSeedItem, ...] = (
    {
        "slug": "cinematic-mountains",
        "title": "Cinematic Mountains",
        "description": (
            "Breathtaking landscapes from around the world. "
            "Let nature inspire your screen."
        ),
        "category": "Nature",
        "width": 3840,
        "height": 2160,
        "quality": "4K",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
            "?auto=format&fit=crop&w=1800&q=90"
        ),
    },
    {
        "slug": "sunset-peaks",
        "title": "Sunset Peaks",
        "category": "Nature",
        "width": 3840,
        "height": 2160,
        "quality": "4K",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "neon-city",
        "title": "Neon City",
        "category": "Cyberpunk",
        "width": 3440,
        "height": 1440,
        "quality": "UWQHD",
        "orientation": "ultrawide",
        "aspect_ratio": "21:9",
        "image_url": (
            "https://images.unsplash.com/photo-1519608487953-e999c86e7455"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "autumn-forest",
        "title": "Autumn Forest",
        "category": "Nature",
        "width": 2560,
        "height": 1440,
        "quality": "QHD",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "moonlit-lake",
        "title": "Moonlit Lake",
        "category": "Night",
        "width": 3840,
        "height": 2160,
        "quality": "4K",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "astronaut-dreams",
        "title": "Astronaut Dreams",
        "category": "Sci-Fi",
        "width": 2560,
        "height": 1440,
        "quality": "QHD",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "ocean-cliff",
        "title": "Ocean Cliff",
        "category": "Nature",
        "width": 1920,
        "height": 1080,
        "quality": "FHD",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "neon-panther",
        "title": "Neon Panther",
        "category": "AMOLED",
        "width": 1080,
        "height": 2400,
        "quality": "Mobile",
        "orientation": "portrait",
        "aspect_ratio": "9:20",
        "image_url": (
            "https://images.unsplash.com/photo-1518837695005-2083093ee35b"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "abstract-flow",
        "title": "Abstract Flow",
        "category": "Abstract",
        "width": 1440,
        "height": 3200,
        "quality": "Mobile",
        "orientation": "portrait",
        "aspect_ratio": "9:20",
        "image_url": (
            "https://images.unsplash.com/photo-1557682250-33bd709cbe85"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "dark-blossom",
        "title": "Dark Blossom",
        "category": "AMOLED",
        "width": 1080,
        "height": 1920,
        "quality": "Mobile",
        "orientation": "portrait",
        "aspect_ratio": "9:16",
        "image_url": (
            "https://images.unsplash.com/photo-1497250681960-ef046c08a56e"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "planet-rise",
        "title": "Planet Rise",
        "category": "Space",
        "width": 3840,
        "height": 2160,
        "quality": "4K",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "neon-mask",
        "title": "Neon Mask",
        "category": "Cyberpunk",
        "width": 1080,
        "height": 2400,
        "quality": "Mobile",
        "orientation": "portrait",
        "aspect_ratio": "9:20",
        "image_url": (
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "subway-night",
        "title": "Subway Night",
        "category": "City",
        "width": 3440,
        "height": 1440,
        "quality": "UWQHD",
        "orientation": "ultrawide",
        "aspect_ratio": "21:9",
        "image_url": (
            "https://images.unsplash.com/photo-1518005020951-eccb494ad742"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "sky-journey",
        "title": "Sky Journey",
        "category": "Anime",
        "width": 3840,
        "height": 2160,
        "quality": "4K",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1500534623283-312aade485b7"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "city-twilight",
        "title": "City Twilight",
        "category": "Anime",
        "width": 2560,
        "height": 1440,
        "quality": "QHD",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1514565131-fce0801e5785"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "samurai-path",
        "title": "Samurai Path",
        "category": "Anime",
        "width": 1920,
        "height": 1080,
        "quality": "FHD",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1493246507139-91e8fad9978e"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "cherry-blossom",
        "title": "Cherry Blossom",
        "category": "Anime",
        "width": 1080,
        "height": 2400,
        "quality": "Mobile",
        "orientation": "portrait",
        "aspect_ratio": "9:20",
        "image_url": (
            "https://images.unsplash.com/photo-1522383225653-ed111181a951"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "neon-girl",
        "title": "Neon Girl",
        "category": "Anime",
        "width": 1080,
        "height": 1920,
        "quality": "Mobile",
        "orientation": "portrait",
        "aspect_ratio": "9:16",
        "image_url": (
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "dreamscape",
        "title": "Dreamscape",
        "category": "Anime",
        "width": 3440,
        "height": 1440,
        "quality": "UWQHD",
        "orientation": "ultrawide",
        "aspect_ratio": "21:9",
        "image_url": (
            "https://images.unsplash.com/photo-1511300636408-a63a89df3482"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "monochrome-peaks",
        "title": "Monochrome Peaks",
        "category": "Minimal",
        "width": 3840,
        "height": 2160,
        "quality": "4K",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1519681393784-d120267933ba"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "desert-dunes",
        "title": "Desert Dunes",
        "category": "Minimal",
        "width": 2560,
        "height": 1440,
        "quality": "QHD",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1509316785289-025f5b846b35"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "geometric-dark",
        "title": "Geometric Dark",
        "category": "Minimal",
        "width": 3440,
        "height": 1440,
        "quality": "UWQHD",
        "orientation": "ultrawide",
        "aspect_ratio": "21:9",
        "image_url": (
            "https://images.unsplash.com/photo-1519608487953-e999c86e7455"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "calm-ocean",
        "title": "Calm Ocean",
        "category": "Minimal",
        "width": 3840,
        "height": 2160,
        "quality": "4K",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "pastel-sky",
        "title": "Pastel Sky",
        "category": "Minimal",
        "width": 1920,
        "height": 1080,
        "quality": "FHD",
        "orientation": "landscape",
        "aspect_ratio": "16:9",
        "image_url": (
            "https://images.unsplash.com/photo-1499346030926-9a72daac6c63"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
    {
        "slug": "minimal-curve",
        "title": "Minimal Curve",
        "category": "Minimal",
        "width": 2560,
        "height": 1600,
        "quality": "WQXGA",
        "orientation": "landscape",
        "aspect_ratio": "16:10",
        "image_url": (
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
            "?auto=format&fit=crop&w=1000&q=80"
        ),
    },
)
