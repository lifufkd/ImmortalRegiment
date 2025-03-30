from pydantic import BaseModel


class MilitaryRank(BaseModel):
    military_rank_id: int
    title: str


class AddMilitaryRank(BaseModel):
    title: str
