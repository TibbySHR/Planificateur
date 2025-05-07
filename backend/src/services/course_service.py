import re
from src.db.models.course_model import Course
from src.schemas.course_schema import CourseBase
from src.services.schedule_service import ScheduleService
import logging
from typing import List

logger = logging.getLogger(__name__)

course_id_pattern = r"[A-Z]{3} ?\d{4}[A-Z0-9]?"
course_code_pattern = r"[A-Z]{3}"


class CourseService:

    @staticmethod
    async def get_all_courses():  # -> List[CourseBase]:
        try:
            return await Course.find().to_list()
        except Exception as e:
            logger.error(f"Error fetching all courses")
            raise

    @staticmethod
    async def search_courses(queries: List[dict], isConjonctive):
        op = "$and" if isConjonctive else "$or"
        return await Course.find({op: queries}).to_list()

    @staticmethod
    async def get_course(
        course_id: str,
    ):  # -> FullCourse:
        return await Course.find_one({"_id": course_id})

    @staticmethod
    async def get_courses(courses_list, include_schedules=False):
        """
        input parameters :
            - courses_list : A list of courses sigle = [IFT1005, MAT1400, etc]
            - include_schedules : A boolean deciding if the schedules will be included.
        output:
            A list of course object. In each of these object, the course might have or not (depending on include_schedules) all its schedules.

        """
        try:

            courses = await Course.find({"_id": {"$in": courses_list}}).to_list()
            if include_schedules:
                schedules = await ScheduleService.get_schedules_from_list(courses_list)
                if not schedules:
                    schedules = []

                for schedule in schedules:
                    schedule_sigle = schedule.sigle
                    # Finds the course object in wich we gonna append the schedule.
                    # We might have multiple schedules added to the same course object over the looping.
                    course = next(
                        (course for course in courses if schedule_sigle == course.id),
                        None,
                    )
                    if course is not None:
                        course.schedules.append(schedule)
            return courses
        except Exception as e:
            logger.error(f"Error fetching courses from list {courses_list}: {e}")
            raise
