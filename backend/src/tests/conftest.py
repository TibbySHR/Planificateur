import pytest
from motor.motor_asyncio import AsyncIOMotorClient
from httpx import ASGITransport, AsyncClient
from beanie import init_beanie
from asyncio import get_event_loop
from src.main import app
from src.core.config import settings
from src.db.models.course_model import Course

"""
Conftest file for pytest.
"""


@pytest.fixture(scope="module")
async def init_db():
    db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)
    database = db_client[settings.MONGO_DB_NAME]
    await init_beanie(database=database, document_models=[Course])
    yield db_client

    db_client.close()


transport = ASGITransport(app=app)


@pytest.fixture(scope="module")
async def async_client(init_db):
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture(scope="module")
def event_loop():

    loop = get_event_loop()

    yield loop


@pytest.fixture(scope="module")
def anyio_backend():
    return ("asyncio", {"use_uvloop": True})
