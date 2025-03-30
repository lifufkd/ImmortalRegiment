from sqlalchemy import text

from backend.api.database.postgresql import postgres_connector
from backend.api.database.base import OrmBase
from backend.api.utilities.config import db_settings
import backend.api.models.wars # noqa
import backend.api.models.heroes  # noqa
import backend.api.models.military_ranks  # noqa


async def create_schema() -> None:
    async with postgres_connector.session_factory() as cursor:
        await cursor.execute(
            text(f"CREATE SCHEMA IF NOT EXISTS {db_settings.DB_SCHEMA};")
        )
        await cursor.commit()


async def create_tables() -> None:
    async with postgres_connector.engine.begin() as connection:
        await connection.run_sync(OrmBase.metadata.create_all)


async def delete_tables() -> None:
    async with postgres_connector.engine.begin() as connection:
        await connection.run_sync(OrmBase.metadata.drop_all)
