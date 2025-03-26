from sqlalchemy import update, select, func
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from src.schemas.heroes import AddHeroDTO, UpdateHeroDTO, FilterHero
from src.models.heroes import Hero
from src.database.postgresql import postgres_connector
from src.utilities.types_storage import ModerationStatus


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


async def update_hero(hero_data: UpdateHeroDTO) -> None:
    async with postgres_connector.session_factory() as session:
        query = (
            update(Hero)
            .filter_by(hero_id=hero_data.hero_id)
            .values(
                **hero_data.model_dump(exclude_none=True)
            )
        )
        await session.execute(query)
        await session.commit()


async def select_hero(hero_id: int) -> Hero:
    async with postgres_connector.session_factory() as session:
        return await session.get(Hero, hero_id)


async def select_heroes(filter_query: FilterHero) -> Page[Hero]:
    async with postgres_connector.session_factory() as session:
        if filter_query.surname_first_letter is None:
            query = (
                select(Hero)
                .filter(
                    Hero.moderation_status == ModerationStatus.APPROVED
                )
                .filter_by(
                    **filter_query.model_dump(exclude_none=True)
                )
            )
        else:
            query = (
                select(Hero)
                .filter(
                    Hero.moderation_status == ModerationStatus.APPROVED,
                    Hero.surname.startswith(filter_query.surname_first_letter)
                )
                .filter_by(
                    **filter_query.model_dump(exclude_none=True, exclude={"surname_first_letter"})
                )
            )

        return await paginate(session, query)


async def select_random_heroes() -> Page[Hero]:
    async with postgres_connector.session_factory() as session:
        query = (
            select(Hero)
            .order_by(func.random())
            .filter(
                Hero.moderation_status == ModerationStatus.APPROVED
            )
        )

        return await paginate(session, query)
