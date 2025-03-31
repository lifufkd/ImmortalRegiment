from api.repository.military_ranks import military_ranks_is_existed
from api.utilities.exceptions_storage import MilitaryRankNotFound


async def validate_military_rank_is_existed(military_rank_id: int) -> None:
    if not await military_ranks_is_existed(military_ranks_id=military_rank_id):
        raise MilitaryRankNotFound(military_rank_id=military_rank_id)
