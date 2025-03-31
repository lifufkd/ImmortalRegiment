from io import BytesIO
from pathlib import Path

from .base import BaseStorage
from .utils import StorageUtils
from api.utilities.config import generic_settings
from api.utilities.types_storage import MessagesTypes


class FileManager(BaseStorage):
    def __init__(self):
        pass

    @staticmethod
    def create_folders_structure():
        heroes_photo_path = generic_settings.MEDIA_FOLDER
        StorageUtils.create_directory(path=heroes_photo_path)

    async def file_exists(self, file_path: Path) -> bool:
        return await StorageUtils.file_exists(file_path=file_path)

    async def write_file(self, file_path: Path, file_data: bytes) -> None:
        await StorageUtils.write_file(file_path=file_path, file_data=file_data)

    async def read_file(self, file_path: Path) -> bytes:
        return await StorageUtils.read_file(file_path=file_path)

    async def delete_file(self, file_path: Path) -> None:
        await StorageUtils.delete_file(file_path=file_path)

    async def check_file_size(self, file_path: Path) -> int:
        return await StorageUtils.check_file_size(file_path=file_path)

    async def archive_files(self, files_paths: list[Path]) -> BytesIO:
        return await StorageUtils().archive_files(files_paths=files_paths)

    async def file_chunk_generator(self, file_paths: list[Path]):
        return StorageUtils.file_chunk_generator(file_paths=file_paths)

    async def range_file_chunk_generator(self, file_path: Path, start_byte: int, end_byte: int):
        return StorageUtils.range_file_chunk_generator(file_path=file_path, start_byte=start_byte, end_byte=end_byte)

    async def validate_file(
            self,
            file_content: bytes,
            file_type: str,
            file_type_filter
    ) -> None:
        await StorageUtils().validate_file(
            file_content=file_content,
            file_type=file_type,
            file_type_filter=file_type_filter
        )

    async def detect_file_type(self, file_type: str) -> MessagesTypes:
        return await StorageUtils().detect_file_type(file_type=file_type)
