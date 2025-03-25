from src.schemas.heroes import Hero, AddHeroDTO
from src.models.heroes import Hero
from src.models.military_ranks import MilitaryRank
from src.models.wars import War
from src.database.postgresql import postgres_connector


async def military_ranks_is_existed(military_ranks_id: int) -> bool:
    async with postgres_connector.session_factory() as session:
        return (await session.get(MilitaryRank, military_ranks_id)) is not None
