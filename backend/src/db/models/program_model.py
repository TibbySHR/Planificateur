from beanie import Document, View
from pydantic import BaseModel, Field
from typing import List, Optional, Union


class Bloc(BaseModel):
    id: str = Field(..., description="Unique identifier of the bloc.")
    name: str = Field(..., description="Name of the boc.")
    description: str = Field(..., description="Description of the bloc.")
    type: str = Field(
        ...,
        description="The type of the credits of the bloc: Obligatoire, option, choix.",
    )
    min: float = Field(..., description="Minimum credits of the bloc")
    max: float = Field(..., description="Maximum credits of the bloc")
    courses: List[str] = Field(..., description="List of course IDs in the program.")


class Segment(BaseModel):
    id: str = Field(..., description="Unique identifier of the segment.")
    name: str = Field(..., description="Name of the segment.")
    blocs: List[Bloc] = Field(..., description="List of bloc of the segment.")
    description: Optional[str] = Field(
        default="", description="Detailed structure description of the segment."
    )


class Course(BaseModel):
    id: str = Field(..., alias="_id", description="Unique identifier of the course.")
    name: str = Field(..., min_length=1, description="Name of the course.")
    description: Optional[str] = Field(
        default="", description="Detailed description of the course."
    )
    credits: float = Field(..., description="Number of credits for the course")


class Program(Document):
    id: str = Field(..., alias="_id", description="Unique identifier of the program.")
    name: str = Field(..., min_length=1, description="Name of the program.")
    segments: List[Segment] = Field(..., description="List of segments in the program.")
    courses: List[str] = Field(..., description="List of course IDs in the program.")
    structure: Optional[str] = Field(
        default="", description="Detailed structure description of the program."
    )

    class Settings:
        name: str = "programs"


class ProgramView(View):
    id: str = Field(..., alias="_id", description="Unique identifier of the program.")
    name: str = Field(..., min_length=1, description="Name of the program.")
    segments: List[Segment] = Field(..., description="List of segments in the program.")
    courses: List[Course] = Field(..., description="List of course IDs in the program.")

    class Settings:
        name: str = "programs_with_courses"
        source = "programs"
        pipeline = [
            {
                "$lookup": {
                    "from": "courses",
                    "localField": "courses",
                    "foreignField": "_id",
                    "as": "course_details",
                    "pipeline": [
                        {
                            "$project": {
                                "_id": 1,
                                "name": 1,
                                "description": 1,
                                "credits": 1,
                            }
                        }
                    ],
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "segments": 1,
                    "courses": "$course_details",
                }
            },
        ]
