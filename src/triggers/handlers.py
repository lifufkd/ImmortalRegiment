import json

from src.storage.local import FileManager
from src.utilities.config import generic_settings
from src.broker.redis import RedisBroker


async def handle_hero_insert_changes(hero_id: str):
    await RedisBroker().broker_client.publish("hero:hero_insert_events", hero_id)


async def handle_hero_delete_changes(photo_name: str):

    file_manager = FileManager()
    filepath = generic_settings.MEDIA_FOLDER / f"{photo_name}"

    if photo_name is None:
        return None
    if not (await file_manager.file_exists(file_path=filepath)):
        return None

    await file_manager.delete_file(file_path=filepath)
