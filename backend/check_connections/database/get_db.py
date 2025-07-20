import aiosqlite
from check_connections.data.config import database


async def get_user(bot_id: int, user_id: int):
    async with aiosqlite.connect(database) as db:
        async with db.execute("SELECT * FROM users WHERE bot_id = ? AND user_id = ?", (bot_id, user_id)) as cursor:
            user = await cursor.fetchone()
            if user:
                return {
                    "bot_id": user[0],
                    "user_id": user[1],
                    "connection_id": user[2],
                    "is_enabled": user[3]
                }
    return None


async def get_bot(bot_id: int):
    async with aiosqlite.connect(database) as db:
        async with db.execute("SELECT * FROM bots WHERE bot_id = ?", (bot_id,)) as cursor:
            bot = await cursor.fetchone()
            if bot:
                return {
                    "worker_id": bot[0],
                    "token": bot[1],
                    "bot_id": bot[2],
                    "bot_username": bot[3],
                    "log_id": bot[4]
                }
    return None
