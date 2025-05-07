from beanie import Document
from pydantic import Field
from uuid import UUID
from typing import List, Optional, Union, Any
from pydantic import field_validator, BaseModel, Field, HttpUrl
from src.db.models.schedule_model import Schedule


class TermAvailability(BaseModel):
    autumn: bool = Field(..., description="Availability for the autumn term.")
    winter: bool = Field(..., description="Availability for the winter term.")
    summer: bool = Field(..., description="Availability for the summer term.")


class PeriodAvailability(BaseModel):
    daytime: bool = Field(..., description="Availability for the daytime period.")
    evening: bool = Field(..., description="Availability for the evening period.")


class Course(Document):
    id: str = Field(..., alias="_id", description="Unique identifier of the course.")
    name: Optional[str] = Field(default="", description="Name of the course.")
    description: Optional[str] = Field(
        default="", description="Detailed description of the course."
    )
    schedules: Optional[list[Schedule]] = Field(
        default_factory=list[Schedule], description="Course schedules"
    )

    credits: float = Field(..., description="Number of credits for the course")
    available_terms: TermAvailability = Field(
        ..., description="Usual terms when the course is available"
    )
    available_periods: PeriodAvailability = Field(
        ..., description="Usual periods when the course is available"
    )
    requirement_text: str = Field(
        "", description="Text describing the course requirements"
    )
    prerequisite_courses: Optional[List[str]] = Field(
        default_factory=list, description="List of prerequisite courses"
    )
    concomitant_courses: Optional[List[str]] = Field(
        default_factory=list, description="List of concomitant courses"
    )
    equivalent_courses: Optional[List[str]] = Field(
        default_factory=list, description="List of equivalent courses"
    )

    # udem_website: Optional[HttpUrl] = Field(default_factory=list, description="URL of the course on the UdeM website")
    # other_websites: Optional[List[HttpUrl]] = Field(default_factory=list, description="List of other relevant websites")
    class Settings:
        name: str = "courses"
