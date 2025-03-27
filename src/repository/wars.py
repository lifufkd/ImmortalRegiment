from sqlalchemy import select

from src.schemas.wars import AddWar
from src.models.wars import War
from src.database.postgresql import postgres_connector


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
