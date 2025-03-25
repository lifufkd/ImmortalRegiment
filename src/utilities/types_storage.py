from enum import Enum
from datetime import datetime, date
from sqlalchemy import text
from sqlalchemy.orm import mapped_column
from typing import Annotated

datetime_auto_set = Annotated[datetime, mapped_column(nullable=False, server_default=text("TIMEZONE('utc', now())"))]
date_not_required_type = Annotated[date, mapped_column(nullable=True)]
primary_key_type = Annotated[int, mapped_column(primary_key=True)]


class AppModes(Enum):
    PRODUCTION = "production"
    DEVELOPMENT = "development"
    TESTING = "testing"


class ModerationStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class MessagesTypes(str, Enum):
    TEXT = 'text'
    IMAGE = 'image'
    VIDEO = 'video'
    AUDIO = 'audio'
    FILE = 'file'
    VOICE = 'voice'
