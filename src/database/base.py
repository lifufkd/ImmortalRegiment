from abc import ABC, abstractmethod
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from src.utilities.config import db_settings


class DatabaseConnector(ABC):

    def __init__(self):
        self.engine: AsyncEngine | None = None
        self.session_factory: sessionmaker | None = None

    @abstractmethod
    def create_engine(self):
        pass

    @abstractmethod
    def create_session_factory(self) -> AsyncSession:
        pass

    @abstractmethod
    def get_session(self) -> AsyncSession:
        pass


class OrmBase(DeclarativeBase):
    metadata = MetaData(schema=db_settings.DB_SCHEMA)
