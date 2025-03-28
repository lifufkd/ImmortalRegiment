#####################################
#            Created by             #
#               SBR                 #
#####################################
import asyncio
from pathlib import Path
from telebot.async_telebot import AsyncTeleBot

from src.utilities.config import generic_settings
from src.repository.heroes import select_hero, hero_is_existed
from src.broker.redis import RedisBroker
from src.storage.local import FileManager
from src.repository.wars import select_war_by_id
from src.repository.military_ranks import select_military_rank_by_id
from tg_bot.buttons import BotButtons
#####################################


bot = AsyncTeleBot(generic_settings.TG_BOT_TOKEN)


async def null_wrapper(data: any) -> any:
    if data is None:
        return "Не указано"
    else:
        return data


def split_string(s: str, max_length: int) -> list[str]:
    return [s[i:i + max_length] for i in range(0, len(s), max_length)]


async def application_events_handler():
    file_manager = FileManager()
    bot_buttons = BotButtons()
    pubsub = RedisBroker().broker_client.pubsub()
    await pubsub.subscribe("hero:hero_insert_events")

    try:
        async for message in pubsub.listen():
            if message["type"] != "message":
                continue

            payload = message["data"].decode()
            new_hero_id = int(payload)

            await hero_is_existed(hero_id=new_hero_id)
            hero_obj = await select_hero(hero_id=new_hero_id)
            hero_military_rank_obj = None
            hero_war_obj = await select_war_by_id(war_id=hero_obj.war_id)
            if hero_obj.military_rank_id is not None:
                hero_military_rank_obj = await select_military_rank_by_id(military_rank_id=hero_obj.military_rank_id)

            msg = (f"ID героя: {await null_wrapper(new_hero_id)}\n"
                   f"Имя: {await null_wrapper(hero_obj.name)}\n"
                   f"Фамилия: {await null_wrapper(hero_obj.surname)}\n"
                   f"Отчество: {await null_wrapper(hero_obj.patronymic)}\n"
                   f"Дата рождения: {await null_wrapper(hero_obj.birth_date)}\n"
                   f"Место рождения: {await null_wrapper(hero_obj.birth_place)}\n"
                   f"Дата смерти: {await null_wrapper(hero_obj.death_date)}\n"
                   f"Война: {await null_wrapper(hero_war_obj.title)}\n"
                   f"Воинское звание: {await null_wrapper(None if hero_military_rank_obj is None else hero_military_rank_obj.title)}\n"
                   f"Воинская специальность: {await null_wrapper(hero_obj.military_specialty)}\n"
                   f"Дата призывы: {await null_wrapper(hero_obj.enlistment_date)}\n"
                   f"Дата демобилизации: {await null_wrapper(hero_obj.discharge_date)}\n"
                   f"Доп. информация: {await null_wrapper(hero_obj.additional_information)}\n"
                   f"Время отправки заявки: {await null_wrapper(hero_obj.created_at)}\n")

            if hero_obj.photo_name is not None:
                photo_obj = await file_manager.read_file(generic_settings.MEDIA_FOLDER / hero_obj.photo_name)
                splited_msg = split_string(s=msg, max_length=1024)
                for index, chunk in enumerate(splited_msg):
                    if len(splited_msg) == 1:
                        await bot.send_photo(generic_settings.TG_BOT_ADMIN, photo_obj, caption=chunk,
                                             reply_markup=bot_buttons.hero(hero_id=new_hero_id))
                    else:
                        if index == 0:
                            await bot.send_photo(generic_settings.TG_BOT_ADMIN, photo_obj, caption=chunk)
                        elif index == len(splited_msg) - 1:
                            await bot.send_message(generic_settings.TG_BOT_ADMIN, chunk,
                                                   reply_markup=bot_buttons.hero(hero_id=new_hero_id))
                        else:
                            await bot.send_message(generic_settings.TG_BOT_ADMIN, chunk)
            else:
                splited_msg = split_string(s=msg, max_length=4096)
                for index, chunk in enumerate(splited_msg):
                    if index == len(splited_msg) - 1:
                        await bot.send_message(generic_settings.TG_BOT_ADMIN, chunk, reply_markup=bot_buttons.hero(hero_id=new_hero_id))
                    else:
                        await bot.send_message(generic_settings.TG_BOT_ADMIN, chunk)
    finally:
        await pubsub.unsubscribe("hero:hero_insert_events")


@bot.message_handler(commands=['start'])
async def start_msg(message):
    user_id = message.from_user.id
    command = message.text.replace('/', '')

    if "start" in command:
        if user_id == generic_settings.TG_BOT_ADMIN:
            await bot.send_message(user_id, "Доброго дня, модератор")
        else:
            await bot.send_message(user_id, "Бот не функционирует")


# @bot.callback_query_handler(func=lambda call: True)
# def callback(call):
#     command = call.data
#     user_id = call.message.chat.id
#
#     if "product" in command:
#         temp_user_data.set_config_data(user_id, "index", 0)
#         temp_user_data.set_config_data(user_id, "product_index", command[7:])
#         bot.send_message(user_id, "Введите ваше имя: ")


async def main():
    asyncio.create_task(application_events_handler())
    await bot.infinity_polling(timeout=10)

if '__main__' == __name__:
    asyncio.run(main())
