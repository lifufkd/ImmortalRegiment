from pydantic import BaseModel


class War(BaseModel):
    war_id: int
    title: str


class AddWar(BaseModel):
    title: str
