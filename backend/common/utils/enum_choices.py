from enum import Enum


class EnumChoices(Enum):
    """
    Provide Django-compatible choices for project-defined enums.
    """

    @classmethod
    def choices(cls) -> list[tuple[object, str]]:
        """
        Return enum values paired with human-readable member names.
        """
        return [(member.value, member.name.replace("_", " ").title()) for member in cls]
