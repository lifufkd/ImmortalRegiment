import redis.asyncio as redis

from src.utilities.config import redis_settings
from .base import BrokerBase


class RedisBroker(BrokerBase):
    def __init__(self):
        super().__init__()
        self.broker_client = None
        self.setup_broker_client()

    def setup_broker_client(self):
        self.broker_client = redis.Redis(
            host=redis_settings.REDIS_HOST,
            port=redis_settings.REDIS_PORT,
            db=2,
            username=redis_settings.REDIS_USER,
            password=redis_settings.REDIS_PASSWORD
        )
