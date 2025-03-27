from fastapi import APIRouter, UploadFile, File, Depends, Query

from src.schemas.wars import War
from src.repository.wars import select_wars

wars_router = APIRouter(
    tags=["Wars"],
    prefix="/wars"
)


@wars_router.get("/", response_model=list[War])
async def get_wars():
    return await select_wars()
