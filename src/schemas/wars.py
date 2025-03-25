from pydantic import BaseModel


class War(BaseModel):
    id: int
    title: str
