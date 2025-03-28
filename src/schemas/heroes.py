from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, Annotated

from src.utilities.types_storage import ModerationStatus


class Hero(BaseModel):
    hero_id: int
    name: str
    surname: str
    patronymic: Optional[str]
    birth_date: Optional[date]
    death_date: Optional[date]
    birth_place: Optional[str]
    photo_name: Optional[str]
    photo_type: Optional[str]
    war_id: int
    military_rank_id: Optional[int]
    military_specialty: Optional[str]
    enlistment_date: Optional[date]
    discharge_date: Optional[date]
    additional_information: Optional[str]
    created_at: datetime


class HeroDTO(Hero):
    moderation_status: ModerationStatus


class AddHero(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=64)]
    surname: Annotated[str, Field(min_length=1, max_length=64)]
    patronymic: Annotated[Optional[str], Field(None, min_length=1, max_length=64)]
    birth_date: Annotated[Optional[date], Field(None)]
    death_date: Annotated[Optional[date], Field(None)]
    birth_place: Annotated[Optional[str], Field(None, min_length=1, max_length=256)]
    war_id: int
    military_rank_id: Annotated[Optional[int], Field(None)]
    military_specialty: Annotated[Optional[str], Field(None, min_length=1, max_length=128)]
    enlistment_date: Annotated[Optional[date], Field(None)]
    discharge_date: Annotated[Optional[date], Field(None)]
    additional_information: Annotated[Optional[str], Field(None, min_length=1, max_length=500)]


class AddHeroDTO(AddHero):
    moderation_status: ModerationStatus
    photo_name: Annotated[Optional[str], Field(None)]
    photo_type: Annotated[Optional[str], Field(None)]


class UpdateHero(BaseModel):
    hero_id: Annotated[Optional[int], Field(None)]
    name: Annotated[Optional[str], Field(None)]
    surname: Annotated[Optional[str], Field(None)]
    patronymic: Annotated[Optional[str], Field(None)]
    birth_date: Annotated[Optional[date], Field(None)]
    death_date: Annotated[Optional[date], Field(None)]
    birth_place: Annotated[Optional[str], Field(None)]
    war_id: Annotated[Optional[int], Field(None)]
    military_rank_id: Annotated[Optional[int], Field(None)]
    military_specialty: Annotated[Optional[str], Field(None)]
    enlistment_date: Annotated[Optional[date], Field(None)]
    discharge_date: Annotated[Optional[date], Field(None)]
    additional_information: Annotated[Optional[str], Field(None)]


class UpdateHeroDTO(UpdateHero):
    moderation_status: Annotated[Optional[ModerationStatus], Field(None)]
    photo_name: Annotated[Optional[str], Field(None)]
    photo_type: Annotated[Optional[str], Field(None)]


class File(BaseModel):
    file_data: bytes
    file_name: str
    file_type: str


class FilterHero(BaseModel):
    surname_first_letter: Annotated[Optional[str], Field(None)]
    war_id: Annotated[Optional[int], Field(None)]
    military_rank_id: Annotated[Optional[int], Field(None)]
    birth_date: Annotated[Optional[date], Field(None)]
    death_date: Annotated[Optional[date], Field(None)]
