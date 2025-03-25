from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from src.repository.init_db import create_tables, create_schema
from src.routes.heroes import heroes_router
from src.utilities.exceptions_storage import HeroNotFound, WarNotFound, MilitaryRankNotFound


@asynccontextmanager
async def lifespan(_: FastAPI):
    await create_schema()
    await create_tables()
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

app.include_router(heroes_router)

