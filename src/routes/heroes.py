from fastapi import APIRouter
from fastapi import status

from src.schemas.heroes import Hero, AddHero
from src.services.heroes import create_hero, get_hero

heroes_router = APIRouter(
    tags=["Heroes"],
    prefix="/heroes"
)


@heroes_router.post("/", status_code=status.HTTP_201_CREATED, response_model=Hero)
async def add_hero(request: AddHero):
    return await create_hero(hero_data=request)


@heroes_router.get("/", response_model=Hero)
async def get_heroes(hero_id: int):
    return await get_hero(hero_id=hero_id)
