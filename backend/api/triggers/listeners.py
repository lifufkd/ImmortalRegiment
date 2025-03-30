import asyncio
import asyncpg

from .handlers import handle_hero_delete_changes, handle_hero_insert_changes
from backend.api.utilities.config import db_settings


async def setup_user_delete_listener():
    asyncpg_engine = await asyncpg.connect(db_settings.asyncpg_postgresql_url)
    await asyncpg_engine.add_listener(
        "hero_delete",
        lambda _, __, ___, payload: asyncio.create_task(handle_hero_delete_changes(payload))
    )
    while True:
        await asyncio.sleep(1)


async def setup_user_insert_listener():
    asyncpg_engine = await asyncpg.connect(db_settings.asyncpg_postgresql_url)
    await asyncpg_engine.add_listener(
        "hero_insert",
        lambda _, __, ___, payload: asyncio.create_task(handle_hero_insert_changes(payload))
    )
    while True:
        await asyncio.sleep(1)
