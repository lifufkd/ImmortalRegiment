from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import FileResponse
from fastapi import status

from src.schemas.heroes import Hero, AddHero
from src.services.heroes import create_hero, get_hero
from src.utilities.config import generic_settings

heroes_router = APIRouter(
    tags=["Heroes"],
    prefix="/heroes"
)


@heroes_router.post("/", status_code=status.HTTP_201_CREATED, response_model=Hero)
async def add_hero(
        request: AddHero = Depends(),
        photo: UploadFile = File(None)
):
    return await create_hero(hero_data=request, hero_photo=photo)


@heroes_router.get("/", response_model=Hero)
async def get_heroes(hero_id: int):
    hero_obj = await get_hero(hero_id=hero_id)
    return {
        "metadata": hero_obj.model_dump(),
        "photo": FileResponse(generic_settings.MEDIA_FOLDER / hero_obj.photo_name)
    }
