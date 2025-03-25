from src.schemas.heroes import Hero, AddHeroDTO
from src.models.heroes import Hero
from src.database.postgresql import postgres_connector


async def hero_is_existed(hero_id: int) -> bool:
    async with postgres_connector.session_factory() as session:
        return (await session.get(Hero, hero_id)) is not None


async def insert_hero(hero_data: AddHeroDTO) -> Hero:
    new_hero = Hero(**hero_data.model_dump(exclude_none=True))
    async with postgres_connector.session_factory() as session:
        session.add(new_hero)
        await session.commit()
        await session.refresh(new_hero)

    return new_hero


async def select_hero(hero_id: int) -> Hero:
    async with postgres_connector.session_factory() as session:
        return await session.get(Hero, hero_id)
