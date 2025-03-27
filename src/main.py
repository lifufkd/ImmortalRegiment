import asyncio
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from fastapi_pagination import add_pagination

from src.repository.init_db import create_tables, create_schema
from src.routes.heroes import heroes_router
from src.routes.military_ranks import military_ranks_router
from src.routes.wars import wars_router
from src.utilities.exceptions_storage import (
    HeroNotFound,
    WarNotFound,
    MilitaryRankNotFound,
    HeroOnModeration,
    InvalidFileType,
    FIleToBig,
    FileNotFound,
    ImageCorrupted
)
from src.storage.local import FileManager
from src.triggers.triggers import setup_hero_delete_trigger
from src.triggers.listeners import setup_user_delete_listener
from src.utilities.data_importer import DataImporter


@asynccontextmanager
async def lifespan(_: FastAPI):
    await create_schema()
    await create_tables()
    await setup_hero_delete_trigger()
    asyncio.create_task(setup_user_delete_listener())
    FileManager.create_folders_structure()
    await DataImporter.import_wars()
    await DataImporter.import_military_ranks()
    yield


app = FastAPI(
    title="OpenContent API",
    description="Free API for any informational resources",
    version="1.0.0",
    lifespan=lifespan
)


@app.exception_handler(Exception)
async def exception_handler(request, exc: Exception) -> JSONResponse:
    match exc:
        case HeroNotFound():
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": str(exc)}
            )
        case HeroOnModeration():
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={"detail": str(exc)}
            )
        case WarNotFound():
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": str(exc)}
            )
        case MilitaryRankNotFound():
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": str(exc)}
            )
        case InvalidFileType():
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": str(exc)},
            )
        case FIleToBig():
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": str(exc)},
            )
        case ImageCorrupted():
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": str(exc)},
            )
        case FileNotFound():
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": str(exc)}
            )

app.include_router(heroes_router)
app.include_router(military_ranks_router)
app.include_router(wars_router)

add_pagination(app)
