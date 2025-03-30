from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from pathlib import Path


class DBSettings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_DATABASE: str = "postgres"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432

    TEST_DB_USER: str
    TEST_DB_PASSWORD: str
    TEST_DB_DATABASE: str = "postgres"
    TEST_DB_HOST: str = "localhost"
    TEST_DB_PORT: int = 5432
    DB_SCHEMA: str = "open_content"

    @property
    def sqlalchemy_postgresql_url(self):
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_DATABASE}"

    @property
    def test_sqlalchemy_postgresql_url(self):
        return f"postgresql+psycopg://{self.TEST_DB_USER}:{self.TEST_DB_PASSWORD}@{self.TEST_DB_HOST}:{self.TEST_DB_PORT}/{self.DB_DATABASE}"

    @property
    def asyncpg_postgresql_url(self):
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_DATABASE}"

    model_config = ConfigDict(extra="allow", env_file=".env")


class RedisSettings(BaseSettings):
    REDIS_USER: str | None = None
    REDIS_PASSWORD: str | None = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    @property
    def redis_url(self):
        if self.REDIS_USER:
            redis_user = self.REDIS_USER
        else:
            redis_user = ""
        if self.REDIS_PASSWORD:
            redis_password = self.REDIS_PASSWORD
        else:
            redis_password = ""
        return f"redis://{redis_user}:{redis_password}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DATABASE}"

    model_config = ConfigDict(extra="allow", env_file=".env")


class GenericSettings(BaseSettings):
    MODE: str = "production"
    WARS_DATA_PATH: Path
    MILITARY_RANKS_DATA_PATH: Path
    MEDIA_FOLDER: Path
    ALLOWED_IMAGE_TYPES: list[str] = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "image/bmp",
        "image/tiff",
        "image/x-icon"
    ]
    ALLOWED_VIDEO_TYPES: list[str] = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-flv",
        "video/x-matroska",
        "video/mpeg",
        "video/3gpp",
        "video/3gpp2"
    ]

    ALLOWED_AUDIO_TYPES: list[str] = [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/webm",
        "audio/aac",
        "audio/flac",
        "audio/x-wav",
        "audio/x-m4a",
        "audio/x-flac",
        "audio/mp4",
        "audio/midi",
        "audio/x-midi"
    ]
    MAX_UPLOAD_IMAGE_SIZE: int = 30
    MAX_UPLOAD_VIDEO_SIZE: int = 8192
    MAX_UPLOAD_AUDIO_SIZE: int = 512
    MAX_UPLOAD_FILE_SIZE: int = 16384
    CHUNK_SIZE: int = 16
    MAX_ITEMS_PER_REQUEST: int = 100

    TG_BOT_TOKEN: str
    TG_BOT_ADMIN: int

    model_config = ConfigDict(extra="allow", env_file=".env")


redis_settings = RedisSettings()
db_settings = DBSettings()
generic_settings = GenericSettings()
