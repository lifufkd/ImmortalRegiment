#####################################
#            Created by             #
#               SBR                 #
#####################################
from telebot import types
#####################################


class BotButtons:
    def __init__(self):
        super(BotButtons, self).__init__()

    @staticmethod
    def hero(hero_id: int):
        markup = types.InlineKeyboardMarkup(row_width=2)
        button1 = types.InlineKeyboardButton("Подтвердить", callback_data=f"accept{hero_id}")
        button2 = types.InlineKeyboardButton("Отклонить", callback_data=f"reject{hero_id}")
        markup.add(button1, button2)
        return markup
