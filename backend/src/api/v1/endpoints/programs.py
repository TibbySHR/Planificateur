from fastapi import APIRouter, HTTPException, Query, status, Path
from typing import List, Optional
from src.services.program_service import ProgramService
from src.services.course_service import CourseService
from src.services.schedule_service import ScheduleService
from ast import literal_eval
import re, logging, os, sys
from string import digits, ascii_letters
from parser.utils.pattern import Pattern

pattern_path = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "./../../../../parser")
)
sys.path.append(pattern_path)

pattern = Pattern()

logger = logging.getLogger(__name__)

router = APIRouter()


def parse_programs_list(programs_list):

    if programs_list == None:
        return []
    try:
        programs_list = literal_eval(programs_list)
        assert type(programs_list) == list
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid programs list"
        )

    # remove white space and dashes
    programs_list = [re.sub(r"[\s-]+", "", id.strip()) for id in programs_list]
    # taking out dashed from the pattern
    program_pattern = "".join(c for c in pattern.program_id_pattern if c != "-")
    for id in programs_list:
        # TODO import pattern.py for sigle_id
        if not re.match(program_pattern, id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid program id: {id}",
            )
    return programs_list


@router.get("/programs")
async def get_programs(
    programs_list: Optional[str] = Query(
        None, description="Programs id list to be fetched"
    ),
    include_courses_detail: Optional[bool] = Query(
        False, description="Include or not courses details of the programs"
    ),
    include_schedules: bool = Query(
        True, description="Include or not courses details of the programs"
    ),
):
    try:
        all_programs_list = []
        if programs_list:
            programs_ids = parse_programs_list(programs_list)

            if len(programs_ids) > 0:
                logger.info("Request for those specific programs_id :")
                for elem in programs_list:
                    logger.info("\t" + elem)

            all_programs_list += await ProgramService.get_programs_from_list(
                programs_ids
            )

        elif programs_list is None:
            return await ProgramService.get_all_programs()

        if include_courses_detail and len(all_programs_list) > 0:
            all_courses_id_list = [
                course for program in all_programs_list for course in program.courses
            ]
            courses = await CourseService.get_courses(
                all_courses_id_list, include_schedules
            )

        else:
            courses = []

        return {"programs": all_programs_list, "courses": courses}

    except Exception as e:
        logger.error(e)
        if type(e) == HTTPException:
            raise e
        else:
            return HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )
