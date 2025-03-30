from backend.api.repository.wars import war_is_existed
from backend.api.utilities.exceptions_storage import WarNotFound


async def validate_war_is_existed(war_id: int) -> None:
    if not await war_is_existed(war_id=war_id):
        raise WarNotFound(war_id=war_id)
