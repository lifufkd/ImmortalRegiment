from fastapi import APIRouter

from backend.api.schemas.wars import War
from backend.api.repository.wars import select_wars

wars_router = APIRouter(
    tags=["Wars"],
    prefix="/wars"
)


@wars_router.get("/", response_model=list[War])
async def get_wars():
    return await select_wars()
