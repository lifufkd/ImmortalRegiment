from src.schemas.heroes import Hero, AddHero, AddHeroDTO, HeroDTO
from src.repository.heroes import insert_hero, select_hero
from src.utilities.types_storage import ModerationStatus
from src.validators.heroes import validate_hero_is_existed
from src.validators.wars import validate_war_is_existed
from src.validators.military_ranks import validate_military_rank_is_existed


async def create_hero(hero_data: AddHero) -> Hero:
    await validate_war_is_existed(war_id=hero_data.war_id)
    await validate_military_rank_is_existed(military_rank_id=hero_data.military_rank_id)

    hero_dto = AddHeroDTO(
        **hero_data.model_dump(),
        moderation_status=ModerationStatus.PENDING
    )
    new_hero = await insert_hero(hero_data=hero_dto)
    return new_hero


async def get_hero(hero_id: int) -> Hero:
    await validate_hero_is_existed(hero_id=hero_id)

    return await select_hero(hero_id=hero_id)
