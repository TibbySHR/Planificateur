from fastapi import APIRouter, HTTPException, Query, status, Path
from src.db.models.course_model import Course
from src.services.faculty_service import FacultyService
from typing import List, Optional, Dict, Annotated
from ast import literal_eval
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


def parse_faculties_list(faculties_list):

    if faculties_list == None:
        return []
    try:
        faculties_list = literal_eval(faculties_list)
        assert type(faculties_list) == list
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid faculties list"
        )
    for faculty in faculties_list:
        if not faculty.isdigit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Faculty must be digit: {faculty}",
            )
        if len(faculty) != 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Faculty must be of length 2: {faculty}",
            )
    return faculties_list


@router.get("/faculties")
async def get_faculties(
    faculties_list: Optional[str] = Query(
        None, description="static list of static static to be fetched"
    )
):

    try:
        all_faculties_list = []

        if faculties_list:
            faculties_ids = parse_faculties_list(faculties_list)
            if len(faculties_ids) > 0:
                all_faculties_list += await FacultyService.get_faculties_from_list(
                    faculties_ids
                )
        else:
            all_faculties_list += await FacultyService.get_all_faculties()
        return all_faculties_list

    except Exception as e:
        logger.error(e)
        if type(e) == HTTPException:
            raise e
        else:
            return HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )
