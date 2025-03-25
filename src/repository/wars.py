from src.schemas.heroes import Hero, AddHeroDTO
from src.models.heroes import Hero
from src.models.military_ranks import MilitaryRank
from src.models.wars import War
from src.database.postgresql import postgres_connector


async def war_is_existed(war_id: int) -> bool:
    async with postgres_connector.session_factory() as session:
        return (await session.get(War, war_id)) is not None
