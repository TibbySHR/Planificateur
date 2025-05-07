from typing import List
from src.db.models.faculty_model import Faculty
from src.schemas.course_schema import CourseBase
import logging

logger = logging.getLogger(__name__)


class FacultyService:

    @staticmethod
    async def get_faculties_from_list(faculty_list):  # -> List[Faculty]:
        """
        input: a list of faculty id = [03,01,etc]
        output: a list of faculty object
        """
        try:
            return await Faculty.find({"_id": {"$in": faculty_list}}).to_list()
        except Exception as e:
            logger.error(f"Error fetching faculties with params {faculty_list}: {e}")
            raise

    @staticmethod
    async def get_all_faculties():  # -> List[Faculty]:
        try:
            return await Faculty.find().to_list()
        except Exception as e:
            logger.error(f"Error fetching all faculties")
            raise
