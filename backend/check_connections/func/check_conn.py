from check_connections.database.get_db import get_bot, get_user
from aiogram import Bot

async def get_conn(bot_id: int, user_id: int):
    bot_db = await get_bot(bot_id)
    token = bot_db["token"]
    user_db = await get_user(bot_id=bot_id, user_id=user_id)
    connection_id = user_db["connection_id"]
    if not user_db["is_enabled"] or not connection_id:
        return False

    bot = Bot(token)
    try:
        connection_bot = await bot.get_business_connection(
            business_connection_id=connection_id
        )
        rights = connection_bot.rights
        if not any([
            rights.can_transfer_and_upgrade_gifts,
            rights.can_view_gifts_and_stars,
            rights.can_transfer_stars
        ]):
            return False
        return True
    
    except:
        return False
    finally:
        await bot.session.close()
