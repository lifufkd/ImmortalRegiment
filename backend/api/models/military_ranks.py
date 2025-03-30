from sqlalchemy.orm import Mapped, mapped_column

from api.database.base import OrmBase
from api.utilities.types_storage import (
    primary_key_type
)


class MilitaryRank(OrmBase):
    __tablename__ = 'military_rank'
    military_rank_id: Mapped[primary_key_type]
    title: Mapped[str] = mapped_column(nullable=False, unique=True)
