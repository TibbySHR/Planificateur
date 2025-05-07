from fastapi import APIRouter, HTTPException, Query, status, Response
from src.services.schedule_service import ScheduleService
from ast import literal_eval
from typing import Optional, List
import re, logging, os, sys
from datetime import date


pattern_path = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "./../../../../parser")
)
sys.path.append(pattern_path)
from utils.pattern import Pattern

pattern = Pattern()

logger = logging.getLogger(__name__)

router = APIRouter()


def parse_courses_list(courses_list):
    if courses_list is None:
        return []

    try:
        courses_list = literal_eval(courses_list)
        assert type(courses_list) == list
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Not a valid list"
        )

    for course_id in courses_list:
        if not re.match(pattern.sigle_id_pattern, course_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not a valid course_id: {course_id}",
            )

    return [id.upper() for id in courses_list]


def parse_semester(min_semester):

    if min_semester is None:
        return None

    elif not re.match(pattern.semester_pattern, min_semester):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not a valid semester: {min_semester}. Exemple: A24",
        )
    return pattern.semester2int(min_semester)


def parse_schedules_ids(schedule_ids):
    if schedule_ids is None:
        return []

    # Transforme into a list and remove empty element
    schedule_ids = [id for id in schedule_ids.split(",") if id != ""]
    # Assert that all id are valid to the regex pattern
    for schedule_id in schedule_ids:
        if not re.match(pattern.schedule_id, schedule_id[:-1]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not a valid schedule request: {schedule_id}. Exemple : A24IFT1005A",
            )
    return [id.upper() for id in schedule_ids]


# Ceci reçoit un list de schedules_ids. Un schedule_id ici est un id comme retrouvé
# dans la db de schedule avec une lettre concaténée à la fin spécifiant la section du cours voulu`
@router.get("/schedules/ics")
async def get_schedules(
    schedule_ids: Optional[str] = Query(
        None,
        description='A list of season+courses+section wanted in the ics calender, format ["A24IFT1065A", <etc>]',
    ),
):
    if schedule_ids:
        # her schedules_ids have an extra letter at the end for the requested section.

        schedule_ids = parse_schedules_ids(schedule_ids)
        return Response(
            content=await ScheduleService.get_ics(schedule_ids),
            media_type="text/calendar",
        )
    else:
        return "Need schedule_ids as query for the calender"


@router.get("/schedules")
async def get_schedules(
    courses_list: Optional[str] = Query(
        None, description="Courses sigle(_id) list to have their schedules fetched"
    ),
    min_semester: Optional[str] = Query(
        None,
        description="The minimum semester onward that will be included, format is like 'A23'",
    ),
):
    try:
        all_schedules_list = []

        if min_semester is not None:
            min_semester = parse_semester(min_semester)
        else:
            # By default, the current semester is selected
            min_semester = parse_semester(pattern.get_this_semester())

        if courses_list:

            courses_ids = parse_courses_list(courses_list)

            if len(courses_ids) > 0:
                all_schedules_list += await ScheduleService.get_schedules_from_list(
                    courses_ids, min_semester=min_semester
                )
        else:
            all_schedules_list += await ScheduleService.get_all_schedules(
                min_semester=min_semester
            )

        return all_schedules_list

    except Exception as e:
        logger.error(e)
        if type(e) == HTTPException:
            raise e
        else:
            return HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )
