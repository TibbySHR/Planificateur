from fastapi import APIRouter, HTTPException, Path, Query, status
from typing import List, Optional
from src.services.course_service import CourseService
from src.schemas.course_schema import CourseBase, CourseFull
from ast import literal_eval
import re, logging
import os, sys

pattern_path = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "./../../parser")
)
sys.path.append(pattern_path)
from utils.pattern import Pattern

pattern = Pattern()
from string import ascii_letters, digits

alphanum = ascii_letters + digits


logger = logging.getLogger(__name__)
router = APIRouter()


def parse_courses_sigle(course_sigles) -> List[str]:
    if course_sigles is None:
        return []

    # Sanitizing the input to only keep safe caracter, then create the list.
    courses_sigle = "".join(
        [c for c in course_sigles.upper() if c in alphanum + ","]
    ).split(",")

    for course_sigle in courses_sigle:
        # Assure that each element of the list is a valid sigle
        if not re.match(pattern.sigle_id_pattern, course_sigle):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not a valid list of sigle.",
            )

    return courses_sigle


def string2regex(mot):
    mot = "".join([c for c in mot if c in alphanum + " "])
    words = mot.split()
    return ".*" + ".*".join(words) + ".*"


@router.get("/courses/search", description="Search for courses in there field.")
async def get_courses(
    isConjonctive: Optional[bool] = Query(
        False,
        description="Determine if the queries parameter are combined \
            with 'AND'.",
    ),
    name: Optional[str] = Query(
        None, description="The string to search in 'name' field."
    ),
    sigle: Optional[str] = Query(
        None, description="The string to search in '_id' (sigle) field."
    ),
    description: Optional[str] = Query(
        None, description="The string to search in 'description' field."
    ),
    exact_credits: Optional[int] = Query(
        None, description="The exact number of credits."
    ),
    min_credits: Optional[int] = Query(
        None, description="The greater or equal number of credits."
    ),
):
    queries = []
    if name:
        queries.append({"name": {"$regex": string2regex(name), "$options": "i"}})
    if sigle:
        queries.append({"_id": {"$regex": string2regex(sigle), "$options": "i"}})
    if description:
        queries.append(
            {"description": {"$regex": string2regex(description), "$options": "i"}}
        )
    if exact_credits:
        queries.append({"credits": exact_credits})
    if min_credits:
        queries.append({"credits": {"$gte": min_credits}})

    if not queries:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No field to given in query params.",
        )
    return await CourseService.search_courses(queries, isConjonctive)


@router.get(
    "/courses",
    description="Retrieve all courses courses details object.",
)
async def get_courses(
    courses_sigle: Optional[str] = Query(
        None,
        description="List of courses ID's(sigle) to be fetched => IFT1005,MAT1400,etc",
    ),
    include_schedule: Optional[bool] = Query(
        False, description="A boolean to decide to include or not the courses schedule."
    ),
):
    """
    Retrieve a list of all courses with short information

    Args:

        courses_sigle : A list of courses sigle (id) => IFT1005,MAT1400,etc
        include_schedule: A boolean to decide to include or not the courses schedule.

    Returns:
        - List[Course]: A list of courses with short information.
    """
    try:
        courses_sigle_list = parse_courses_sigle(courses_sigle)
        return await CourseService.get_courses(courses_sigle_list, include_schedule)

    except Exception as e:
        logger.error(e)
        if type(e) == HTTPException:
            raise e
        else:
            return HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )


@router.get(
    "/courses/{course_id}",
    summary="Get course",
    description="Retrieve detailed information about a specific course.",
)
async def get_course(
    course_id: str = Path(..., description="The id of the course to retrieve"),
):
    """
    Retrieve detailed information about a specific course.

    Args:
        course_id (str): The ID of the course to retrieve.

    Raises:
        HTTPException: If the course is not found.

    Returns:
        The detailed information about the course.
    """
    try:
        # parse_courses_sigle expected a list separated by comma, so just retrieve the first element.
        course_id = parse_courses_sigle(course_id)[0]
        if re.match(pattern.sigle_id_pattern, course_id):
            print(course_id)
            course = await CourseService.get_course(course_id)

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Not a valid sigle."
            )
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Course not found"
            )

        return course

    except Exception as e:
        logger.error(e)
        if type(e) == HTTPException:
            raise e
        else:
            return HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )
