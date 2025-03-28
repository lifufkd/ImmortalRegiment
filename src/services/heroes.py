from fastapi import UploadFile
from fastapi_pagination import Page
from sqlalchemy import insert

from src.schemas.heroes import Hero, AddHero, AddHeroDTO, File, FilterHero
from src.repository.heroes import insert_hero, select_hero, select_heroes, select_random_heroes, insert_hero_draft
from src.utilities.types_storage import ModerationStatus, MessagesTypes
from src.validators.heroes import validate_hero_is_existed
from src.validators.wars import validate_war_is_existed
from src.validators.military_ranks import validate_military_rank_is_existed
from src.utilities.exceptions_storage import HeroOnModeration, FileNotFound
from src.utilities.config import generic_settings
from src.storage.local import FileManager
from src.database.postgresql import postgres_connector


async def create_hero(hero_data: AddHero, hero_photo: UploadFile | None) -> Hero:

    async def validate_image() -> None:
        file_manager = FileManager()
        await file_manager.validate_file(
            file_content=hero_photo_obj.file_data,
            file_type=hero_photo_obj.file_type,
            file_type_filter=MessagesTypes.IMAGE
        )

    async def save_media_to_file(photo_name: str) -> None:
        photo_save_path = generic_settings.MEDIA_FOLDER / photo_name
        await FileManager().write_file(file_path=photo_save_path, file_data=hero_photo_obj.file_data)

    await validate_war_is_existed(war_id=hero_data.war_id)
    if hero_data.military_rank_id is not None:
        await validate_military_rank_is_existed(military_rank_id=hero_data.military_rank_id)

    hero_dto = AddHeroDTO(
        **hero_data.model_dump(),
        moderation_status=ModerationStatus.PENDING
    )

    if hero_photo is None:
        new_hero_obj = await insert_hero(hero_data=hero_dto)
    else:
        async with postgres_connector.session_factory() as session:
            hero_photo_obj = File(
                file_data=await hero_photo.read(),
                file_name=hero_photo.filename,
                file_type=hero_photo.content_type
            )
            await validate_image()

            new_hero_obj = await insert_hero_draft(hero_data=hero_dto, session=session)
            hero_id = new_hero_obj.hero_id

            file_name = f"{hero_id}.{hero_photo_obj.file_name.split('.')[-1]}"
            new_hero_obj.photo_name = file_name
            new_hero_obj.photo_type = hero_photo_obj.file_type

            await session.commit()
            await save_media_to_file(photo_name=file_name)

            new_hero_obj = await select_hero(hero_id=hero_id)

    return new_hero_obj


async def fetch_hero(hero_id: int) -> Hero:
    await validate_hero_is_existed(hero_id=hero_id)
    hero_obj = await select_hero(hero_id=hero_id)
    if hero_obj.moderation_status != ModerationStatus.APPROVED:
        raise HeroOnModeration(hero_id=hero_id)

    return await select_hero(hero_id=hero_id)


async def fetch_heroes(filter_query: FilterHero) -> Page[Hero]:
    return await select_heroes(filter_query=filter_query)


async def fetch_random_heroes() -> Page[Hero]:
    return await select_random_heroes()


async def get_hero_photo(hero_id: int) -> dict[str, any]:
    await validate_hero_is_existed(hero_id=hero_id)

    hero_obj = await select_hero(hero_id=hero_id)
    filepath = generic_settings.MEDIA_FOLDER / f"{hero_obj.photo_name}"
    if hero_obj.moderation_status != ModerationStatus.APPROVED:
        raise HeroOnModeration(hero_id=hero_id)
    if not await FileManager().file_exists(file_path=filepath):
        raise FileNotFound()

    return {
        "file_path": filepath,
        "file_type": hero_obj.photo_type
    }
