from typing import List
from src.db.models.program_model import Program, ProgramView
from src.db.models.course_model import Course
import logging

logger = logging.getLogger(__name__)


class ProgramService:
    @staticmethod
    async def get_all_programs() -> List[Program]:
        try:
            return await Program.find().to_list()
        except Exception as e:
            logger.error(f"Error fetching all programs")
            raise

    @staticmethod
    async def get_programs_from_list(programs_list) -> List[Program]:
        try:
            programs = await Program.find({"_id": {"$in": programs_list}}).to_list()
            return programs

        except Exception as e:
            logger.error(
                f"Error fetching programs with program list {programs_list}: {e}"
            )
            raise
