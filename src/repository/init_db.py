from sqlalchemy import text

from src.database.postgresql import postgres_connector
from src.database.base import OrmBase
from src.utilities.config import db_settings
import src.models.wars # noqa
import src.models.heroes # noqa
import src.models.military_ranks # noqa


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
