from slowapi import Limiter
from slowapi.util import get_remote_address

from api.utilities.config import redis_settings


limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=f'redis://{redis_settings.REDIS_HOST}:{redis_settings.REDIS_PORT}/1'
)
