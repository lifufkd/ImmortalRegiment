from sqlalchemy import select

from api.models.military_ranks import MilitaryRank
from api.schemas.military_ranks import AddMilitaryRank
from api.database.postgresql import postgres_connector


async def military_ranks_is_existed(military_ranks_id: int) -> bool:
    async with postgres_connector.session_factory() as session:
        return (await session.get(MilitaryRank, military_ranks_id)) is not None


async def select_military_ranks() -> list[MilitaryRank]:
    async with postgres_connector.session_factory() as session:
        query = (
            select(MilitaryRank)
        )
        raw_data = await session.execute(query)
        military_ranks_data = raw_data.scalars().all()

    return military_ranks_data


async def insert_military_ranks(military_ranks_data: list[AddMilitaryRank]) -> None:
    military_ranks_objs = list()
    async with postgres_connector.session_factory() as session:
        for military_ranks in military_ranks_data:
            military_ranks_db_obj = MilitaryRank(**military_ranks.model_dump(exclude_none=True))
            military_ranks_objs.append(military_ranks_db_obj)

        session.add_all(military_ranks_objs)
        await session.commit()


async def select_military_rank_by_id(military_rank_id: int) -> MilitaryRank:
    async with postgres_connector.session_factory() as session:
        query = (
            select(MilitaryRank)
            .filter_by(military_rank_id=military_rank_id)
        )
        raw_data = await session.execute(query)
        military_rank_data = raw_data.scalar()

    return military_rank_data
