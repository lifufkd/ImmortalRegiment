import json

from src.storage.local import FileManager
from src.utilities.config import generic_settings


async def handle_hero_delete_changes(payload: str):
    row_data = json.loads(payload)
    file_manager = FileManager()
    filepath = generic_settings.MEDIA_FOLDER / f"{row_data.get('photo_name')}"

    if row_data.get('photo_name') is None:
        return None
    if not (await file_manager.file_exists(file_path=filepath)):
        return None

    await file_manager.delete_file(file_path=filepath)
