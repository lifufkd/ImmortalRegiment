import sys
from sqlalchemy.ext.asyncio.engine import create_async_engine, AsyncEngine
from sqlalchemy.ext.asyncio.session import async_sessionmaker, AsyncSession

from .base import DatabaseConnector
from src.utilities.config import generic_settings, db_settings
from src.utilities.types_storage import AppModes


class PostgresqlConnector(DatabaseConnector):
    def __init__(self):
        super().__init__()
        self.engine: AsyncEngine | None = None
        self.session_factory: async_sessionmaker | None = None

        self.create_engine()
        self.create_session_factory()

    def create_engine(self):
        if generic_settings.MODE == AppModes.PRODUCTION.value or generic_settings.MODE == AppModes.DEVELOPMENT.value:
            self.engine = create_async_engine(db_settings.sqlalchemy_postgresql_url)
        elif generic_settings.MODE == AppModes.TESTING.value:
            self.engine = create_async_engine(db_settings.test_sqlalchemy_postgresql_url)
        else:
            sys.exit("Invalid launch mode specified! Only production, development and testing are supported!")

    def create_session_factory(self):
        self.session_factory = async_sessionmaker(bind=self.engine)

    async def get_session(self) -> AsyncSession:
        async with self.session_factory() as session:
            yield session


postgres_connector = PostgresqlConnector()


