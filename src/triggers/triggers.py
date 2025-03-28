from sqlalchemy import text

from src.database.postgresql import postgres_connector
from src.utilities.config import db_settings


async def setup_hero_insert_trigger():
    async with postgres_connector.session_factory() as cursor:
        await cursor.execute(
            text("""
                CREATE OR REPLACE FUNCTION hero_insert()
                RETURNS TRIGGER AS $$
                DECLARE
                    hero_id INTEGER;
                BEGIN
                    IF TG_OP = 'INSERT' THEN
                        hero_id := NEW.hero_id;
                        PERFORM pg_notify('hero_insert', hero_id::text);
                    END IF;

                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            """)
        )
        await cursor.execute(
            text(f"DROP TRIGGER IF EXISTS hero_insert_trigger ON {db_settings.DB_SCHEMA}.hero")
        )
        await cursor.execute(
            text(f"""
                CREATE TRIGGER hero_insert_trigger
                AFTER INSERT OR DELETE ON {db_settings.DB_SCHEMA}.hero
                FOR EACH ROW
                EXECUTE FUNCTION hero_insert()
            """)
        )

        await cursor.commit()


async def setup_hero_delete_trigger():
    async with postgres_connector.session_factory() as cursor:
        await cursor.execute(
            text("""
                CREATE OR REPLACE FUNCTION hero_delete()
                RETURNS TRIGGER AS $$
                DECLARE
                    photo_name TEXT;
                BEGIN
                    IF TG_OP = 'DELETE' THEN
                        photo_name := OLD.photo_name;
                        PERFORM pg_notify('hero_delete', photo_name::text);
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
