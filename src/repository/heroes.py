from sqlalchemy import update

from src.schemas.heroes import Hero, AddHeroDTO, UpdateHeroDTO
from src.models.heroes import Hero
from src.database.postgresql import postgres_connector


async def hero_is_existed(hero_id: int) -> bool:
    async with postgres_connector.session_factory() as session:
        return (await session.get(Hero, hero_id)) is not None


async def insert_hero(hero_data: AddHeroDTO) -> Hero:
    async with postgres_connector.session_factory() as session:
        hero_db_obj = Hero(**hero_data.model_dump(exclude_none=True))
        session.add(hero_db_obj)
        await session.commit()
        await session.refresh(hero_db_obj)

    return hero_db_obj


async def update_hero(hero_data: UpdateHeroDTO) -> Hero:
    async with postgres_connector.session_factory() as session:
        query = (
            update(Hero)
            .filter_by(hero_id=hero_data.hero_id)
            .values(
                **hero_data.model_dump(exclude_none=True)
            )
            .returning(Hero)
        )
        raw_data = await session.execute(query)
        result = raw_data.scalar()
        await session.commit()

    return result


async def select_hero(hero_id: int) -> Hero:
    async with postgres_connector.session_factory() as session:
        return await session.get(Hero, hero_id)
