from fastapi import APIRouter, HTTPException, Query, status, Path
from src.db.models.course_model import Course
from src.services.search_service import SearchService
from typing import List, Optional, Dict, Annotated
from ast import literal_eval
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/search/advanced")
async def search(
    query: str = Query(
        ...,
        description="Query string of an abstract syntax tree to advanced search for schedules.",
    ),
    season: str = Query(
        None, description="The season in which the schedules are fetched. Ex: A24."
    ),
):
    try:
        return await SearchService.searchAdvanced(query, season)

    except Exception as e:
        logger.error(e)
        if type(e) == HTTPException:
            raise e
