from src.tasks.celery import celery_app
from src.repository.heroes import delete_pending_heroes, delete_rejected_heroes


@celery_app.task
async def clean_pending_application():
    await delete_pending_heroes()


@celery_app.task
async def clean_rejected_application():
    await delete_rejected_heroes()
