from pydantic import BaseModel


class MilitaryRank(BaseModel):
    id: int
    title: str
