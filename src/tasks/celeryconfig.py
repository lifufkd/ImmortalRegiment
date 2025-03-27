from celery.schedules import crontab

from src.utilities.config import redis_settings


broker_url = f'redis://{redis_settings.REDIS_HOST}:{redis_settings.REDIS_PORT}/{redis_settings.REDIS_DATABASE}'
worker_pool = 'celery_aio_pool.pool:AsyncIOPool'
timezone = "Europe/Moscow"
accept_content = ['json']
broker_connection_retry_on_startup = True
tasks = [
    'src.tasks.tasks.clean_pending_application'
]


beat_schedule = {
    'delete_pending_heroes_every_week': {
        'task': 'src.tasks.tasks.clean_pending_application',
        'schedule': crontab(day_of_week="1")
    },
    'delete_rejected_heroes_every_day': {
        'task': 'src.tasks.tasks.clean_rejected_application',
        'schedule': crontab(hour="0", minute="0")
    },
}
