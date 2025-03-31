from fastapi import APIRouter, UploadFile, File, Depends, Query, status, Request
from fastapi.responses import StreamingResponse
from fastapi_pagination import Page

from api.schemas.heroes import Hero, AddHero, FilterHero
from api.services.heroes import create_hero, fetch_hero, get_hero_photo, fetch_heroes, fetch_random_heroes
from api.limiter.limiter import limiter

heroes_router = APIRouter(
    tags=["Heroes"],
    prefix="/heroes"
)


@heroes_router.post("/", status_code=status.HTTP_201_CREATED, response_model=Hero)
@limiter.limit("1/minute")
async def add_hero(
        request: Request,
        hero_data: AddHero = Depends(),
        photo: UploadFile = File(None)
):
    return await create_hero(hero_data=hero_data, hero_photo=photo)


@heroes_router.get("/", response_model=Page[Hero])
async def get_heroes(filter_query: FilterHero = Query()):
    return await fetch_heroes(filter_query=filter_query)


@heroes_router.get("/random", response_model=Page[Hero])
async def get_heroes():
    return await fetch_random_heroes()


@heroes_router.get("/{hero_id}")
async def get_hero(hero_id: int):
    hero_obj = await fetch_hero(hero_id=hero_id)
    return hero_obj


@heroes_router.get("/{hero_id}/photo")
async def get_photo(hero_id: int):
    metadata = await get_hero_photo(hero_id=hero_id)
    return StreamingResponse(metadata["file_path"].open("rb"), media_type=metadata["file_type"])
