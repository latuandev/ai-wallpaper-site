from django.conf import settings


_MESSAGES = {
    "en-us": {
        "common": {},
    },
}

MESSAGES = _MESSAGES[settings.LANGUAGE_CODE]
