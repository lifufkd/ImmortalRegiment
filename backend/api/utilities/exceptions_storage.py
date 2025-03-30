from typing import Union, Literal
from backend.api.utilities.types_storage import MessagesTypes


class HeroNotFound(Exception):
    def __init__(self, hero_id: int | None):
        if hero_id is None:
            detail = "Hero is not found"
        else:
            detail = f"Hero with id {hero_id} is not found"
        super().__init__(detail)


class HeroOnModeration(Exception):
    def __init__(self, hero_id: int):
        if hero_id is None:
            detail = "Hero on moderation"
        else:
            detail = f"Hero with id {hero_id} on moderation"
        super().__init__(detail)


class WarNotFound(Exception):
    def __init__(self, war_id: int | None):
        if war_id is None:
            detail = "War is not found"
        else:
            detail = f"War with id {war_id} is not found"
        super().__init__(detail)


class MilitaryRankNotFound(Exception):
    def __init__(self, military_rank_id: int | None):
        if military_rank_id is None:
            detail = "Military rank is not found"
        else:
            detail = f"Military rank with id {military_rank_id} is not found"
        super().__init__(detail)


class InvalidFileType(Exception):
    def __init__(
            self,
            file_type_name:
            Union[
                Literal[
                    MessagesTypes.IMAGE,
                    MessagesTypes.VIDEO,
                    MessagesTypes.AUDIO,
                    MessagesTypes.FILE
                ]
            ],
            file_types: str
    ):
        detail = f"Invalid {file_type_name} type. Only {file_types} are allowed."
        super().__init__(detail)


class FIleToBig(Exception):
    def __init__(
            self,
            file_type_name:
            Union[
                Literal[
                    MessagesTypes.IMAGE,
                    MessagesTypes.VIDEO,
                    MessagesTypes.AUDIO,
                    MessagesTypes.FILE
                ]
            ],
            size_limit: int
    ):
        detail = f"{file_type_name} size exceeds {size_limit} MB limit."
        super().__init__(detail)


class ImageCorrupted(Exception):
    def __init__(self):
        detail = "Image file is corrupted"
        super().__init__(detail)


class FileNotFound(Exception):
    def __init__(self):
        detail = "File not found"
        super().__init__(detail)


