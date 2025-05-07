from beanie import Document
from pydantic import Field
from uuid import UUID
from typing import List, Optional, Union, Any
from pydantic import field_validator, BaseModel, Field, HttpUrl


class Schedule(Document):
    id: str = Field(
        ...,
        alias="_id",
        description="Unique identifier of a schedule. semester concatenated to sigle",
    )
    sigle: str = Field(..., description="Sigle identifier of a schedule.")
    name: str = Field(..., description="Name of the course.")
    semester: str = Field(..., description="Semester.")
    sections: Any = Field(..., description="Section of a schedule.")
    fetch_date: str = Field(
        ..., description="The iso format of the date the schedules was fetched"
    )
    semester_int: int = Field(
        ..., description="The semester converted to integer for query reason"
    )

    class Settings:
        name: str = "schedules"
