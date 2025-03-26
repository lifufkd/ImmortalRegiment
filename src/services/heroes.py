from fastapi import UploadFile

from src.schemas.heroes import Hero, AddHero, AddHeroDTO, UpdateHeroDTO, File
from src.repository.heroes import insert_hero, select_hero, update_hero
from src.utilities.types_storage import ModerationStatus, MessagesTypes
from src.validators.heroes import validate_hero_is_existed
from src.validators.wars import validate_war_is_existed
from src.validators.military_ranks import validate_military_rank_is_existed
from src.utilities.exceptions_storage import HeroOnModeration
from src.utilities.config import generic_settings
from src.storage.local import FileManager


async def create_hero(hero_data: AddHero, hero_photo: UploadFile | None) -> Hero:

    async def validate_image() -> None:
        file_manager = FileManager()
        await file_manager.validate_file(
            file_content=hero_photo_obj.file_data,
            file_type=hero_photo_obj.file_type,
            file_type_filter=MessagesTypes.IMAGE
        )

    async def save_media_to_file():
        photo_save_path = generic_settings.MEDIA_FOLDER / file_name
        await FileManager().write_file(file_path=photo_save_path, file_data=hero_photo_obj.file_data)

    await validate_war_is_existed(war_id=hero_data.war_id)
    if hero_data.military_rank_id is not None:
        await validate_military_rank_is_existed(military_rank_id=hero_data.military_rank_id)

    hero_dto = AddHeroDTO(
        **hero_data.model_dump(),
        moderation_status=ModerationStatus.PENDING
    )

    if hero_photo is None:
        new_hero = await insert_hero(hero_data=hero_dto)
    else:
        hero_photo_obj = File(
            file_data=await hero_photo.read(),
            file_name=hero_photo.filename,
            file_type=hero_photo.content_type
        )
        await validate_image()
        new_hero = await insert_hero(hero_data=hero_dto)
        file_name = f"{new_hero.hero_id}.{hero_photo_obj.file_name.split('.')[-1]}"

        hero_photo_dto_obj = UpdateHeroDTO(
            hero_id=new_hero.hero_id,
            photo_name=file_name,
            photo_type=hero_photo_obj.file_type
        )
        new_hero = await update_hero(hero_data=hero_photo_dto_obj)
        await save_media_to_file()

    return new_hero


async def get_hero(hero_id: int) -> Hero:
    await validate_hero_is_existed(hero_id=hero_id)
    hero_obj = await select_hero(hero_id=hero_id)
    if hero_obj.moderation_status != ModerationStatus.APPROVED:
        raise HeroOnModeration(hero_id=hero_id)

    return await select_hero(hero_id=hero_id)
