from fastapi import APIRouter

from api.schemas.military_ranks import MilitaryRank
from api.repository.military_ranks import select_military_ranks

military_ranks_router = APIRouter(
    tags=["Military Ranks"],
    prefix="/military-ranks"
)


@military_ranks_router.get("/", response_model=list[MilitaryRank])
async def get_military_ranks():
    ddd = await select_military_ranks()
    return ddd