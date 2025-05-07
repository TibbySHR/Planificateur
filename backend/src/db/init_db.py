from motor.motor_asyncio import AsyncIOMotorClient
from src.core.config import settings
from beanie import init_beanie
from src.db.models.course_model import Course
from src.db.models.program_model import Program, ProgramView
from src.db.models.faculty_model import Faculty
from src.db.models.schedule_model import Schedule
import sys


async def init_db():
    try:
        db_client = AsyncIOMotorClient(
            settings.MONGO_CONNECTION_STRING,
            serverSelectionTimeoutMS=settings.CONNECTION_TIMEOUT,
        )
        database = db_client[settings.MONGO_DB_NAME]
        await db_client.server_info()
    except:
        print("Failed connection to mongo_db", file=sys.stderr)
        exit(1)

    try:
        await init_beanie(
            database,
            document_models=[Course, Program, ProgramView, Faculty, Schedule],
            recreate_views=True,
        )  # => list of documents
    except:
        print("Failed setting up beanie", file=sys.stderr)
        exit(1)

    return db_client
