from sqlalchemy import select

from api.schemas.wars import AddWar
from api.models.wars import War
from api.database.postgresql import postgres_connector


async def war_is_existed(war_id: int) -> bool:
    async with postgres_connector.session_factory() as session:
        return (await session.get(War, war_id)) is not None


async def select_wars() -> list[War]:
    async with postgres_connector.session_factory() as session:
        query = (
            select(War)
        )
        raw_data = await session.execute(query)
        wars_data = raw_data.scalars().all()

    return wars_data


async def insert_wars(wars_data: list[AddWar]) -> None:
    wars_objs = list()
    async with postgres_connector.session_factory() as session:
        for war in wars_data:
            war_db_obj = War(**war.model_dump(exclude_none=True))
            wars_objs.append(war_db_obj)

        session.add_all(wars_objs)
        await session.commit()


async def select_war_by_id(war_id: int) -> War:
    async with postgres_connector.session_factory() as session:
        query = (
            select(War)
            .filter_by(war_id=war_id)
        )
        raw_data = await session.execute(query)
        war_data = raw_data.scalar()

    return war_data
