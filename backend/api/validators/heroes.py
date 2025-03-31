from api.repository.heroes import hero_is_existed
from api.utilities.exceptions_storage import HeroNotFound


async def validate_hero_is_existed(hero_id: int) -> None:
    if not await hero_is_existed(hero_id=hero_id):
        raise HeroNotFound(hero_id=hero_id)

