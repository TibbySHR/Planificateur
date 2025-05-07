from fastapi import APIRouter
from src.api.v1.endpoints import courses, programs, faculties, schedules, search

"""
This module centralizes and aggregates the API routes into a single unified router.
"""

router = APIRouter()
router.include_router(courses.router, tags=["courses"])
router.include_router(programs.router, tags=["programs"])
router.include_router(faculties.router, tags=["faculties"])
router.include_router(schedules.router, tags=["schedules"])
router.include_router(search.router, tags=["search"])
