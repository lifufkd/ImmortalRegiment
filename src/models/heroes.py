from sqlalchemy import ForeignKey
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.base import OrmBase
from src.utilities.types_storage import (
    primary_key_type,
    date_not_required_type,
    ModerationStatus,
    datetime_auto_set
)


class Hero(OrmBase):
    __tablename__ = 'hero'
    hero_id: Mapped[primary_key_type]
    name: Mapped[str] = mapped_column(nullable=False)
    surname: Mapped[str] = mapped_column(nullable=False, index=True)
    patronymic: Mapped[str] = mapped_column(nullable=True)
    birth_date: Mapped[date_not_required_type] = mapped_column(nullable=True, index=True)
    death_date: Mapped[date_not_required_type] = mapped_column(nullable=True, index=True)
    birth_place: Mapped[str] = mapped_column(nullable=True)
    photo_name: Mapped[str] = mapped_column(nullable=True)
    photo_type: Mapped[str] = mapped_column(nullable=True)
    war_id: Mapped[int] = mapped_column(
        ForeignKey("war.war_id"),
        nullable=False,
        index=True
    )
    military_rank_id: Mapped[int] = mapped_column(
        ForeignKey("military_rank.military_rank_id"),
        nullable=True,
        index=True
    )
    military_specialty: Mapped[str] = mapped_column(nullable=True)
    enlistment_date: Mapped[date_not_required_type]
    discharge_date: Mapped[date_not_required_type]
    additional_information: Mapped[str] = mapped_column(nullable=True)

    moderation_status: Mapped[ModerationStatus] = mapped_column(nullable=False)
    created_at: Mapped[datetime_auto_set] = mapped_column(nullable=False)
