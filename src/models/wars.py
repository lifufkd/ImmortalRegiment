from sqlalchemy.orm import Mapped, mapped_column

from src.database.base import OrmBase
from src.utilities.types_storage import (
    primary_key_type
)


class War(OrmBase):
    __tablename__ = 'war'
    war_id: Mapped[primary_key_type]
    title: Mapped[str] = mapped_column(nullable=False, unique=True)
