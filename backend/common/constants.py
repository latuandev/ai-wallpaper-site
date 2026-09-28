# --------------------------------|
# Section for Class choice enums. |
# --------------------------------|

from common.utils.enum_choices import EnumChoices


class Orientation(str, EnumChoices):
    """
    Define the supported factual orientations of wallpaper assets.
    """

    LANDSCAPE = "landscape"
    PORTRAIT = "portrait"
    ULTRAWIDE = "ultrawide"


# -------------------------|
# Section for constants.   |
# -------------------------|
