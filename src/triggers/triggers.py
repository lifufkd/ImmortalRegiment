from sqlalchemy import text

from src.database.postgresql import postgres_connector
from src.utilities.config import db_settings


async def setup_hero_delete_trigger():
    async with postgres_connector.session_factory() as cursor:
        await cursor.execute(
            text("""
                CREATE OR REPLACE FUNCTION hero_delete()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF TG_OP = 'DELETE' THEN
                        PERFORM pg_notify('hero_delete', row_to_json(OLD)::text);
                    END IF;

                    RETURN NULL;
                END;
                $$ LANGUAGE plpgsql;
            """)
        )
        await cursor.execute(
            text(f"DROP TRIGGER IF EXISTS hero_delete_trigger ON {db_settings.DB_SCHEMA}.hero")
        )
        await cursor.execute(
            text(f"""
                CREATE TRIGGER hero_delete_trigger
                AFTER DELETE ON {db_settings.DB_SCHEMA}.hero
                FOR EACH ROW
                EXECUTE FUNCTION hero_delete()
            """)
        )

        await cursor.commit()
