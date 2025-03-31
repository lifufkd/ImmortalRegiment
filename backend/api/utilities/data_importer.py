import json

from .config import generic_settings
from api.schemas.wars import AddWar
from api.schemas.military_ranks import AddMilitaryRank
from api.repository.wars import select_wars, insert_wars
from api.repository.military_ranks import select_military_ranks, insert_military_ranks


class DataImporter:
    def __init__(self):
        pass

    @staticmethod
    async def import_wars():
        wars_objs_data = list()
        existed_wars_objs = await select_wars()
        existed_wars_titles = [war.title for war in existed_wars_objs]

        with open(str(generic_settings.WARS_DATA_PATH), "r", encoding="utf-8") as f:
            wars_data = json.loads(f.read())

        for war in wars_data:
            if war["title"] in existed_wars_titles:
                continue

            wars_objs_data.append(
                AddWar(
                    title=war["title"]
                )
            )

        await insert_wars(wars_data=wars_objs_data)

    @staticmethod
    async def import_military_ranks():
        military_ranks_objs_data = list()
        existed_military_ranks_objs = await select_military_ranks()
        existed_military_ranks_titles = [existed_military.title for existed_military in existed_military_ranks_objs]

        with open(str(generic_settings.MILITARY_RANKS_DATA_PATH), "r", encoding="utf-8") as f:
            military_ranks_data = json.loads(f.read())

        for military_ranks in military_ranks_data:
            if military_ranks["title"] in existed_military_ranks_titles:
                continue

            military_ranks_objs_data.append(
                AddMilitaryRank(
                    title=military_ranks["title"]
                )
            )

        await insert_military_ranks(military_ranks_data=military_ranks_objs_data)

