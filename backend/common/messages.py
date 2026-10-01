from django.conf import settings


_MESSAGES = {
    "en-us": {
        "common": {},
        "wallpapers": {
            "image_unavailable": "The wallpaper image is unavailable.",
        },
    },
}

MESSAGES = _MESSAGES[settings.LANGUAGE_CODE]
