from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import List, Optional
from src.db.models.course_model import TermAvailability, PeriodAvailability


class CourseBase(BaseModel):
    id: str = Field(..., description="Unique identifier of the course.")
    name: str = Field(..., description="Name of the course.")
    description: str = Field(..., description="Detailed description of the course.")
    credits: float = Field(..., description="Number of credits for the course")
    available_terms: TermAvailability = Field(
        ..., description="Usual terms when the course is available"
    )
    available_periods: PeriodAvailability = Field(
        ..., description="Usual periods when the course is available"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "IFT2255",
                "name": "Génie logiciel",
                "description": "Introduction au génie logiciel. Cycles de développement. Analyse, modélisation et spécification. Conception. Développement orienté objet. Mise au point. Outils et environnements de développement.",
                "credits": 3.0,
                "available_terms": {
                    "autumn": True,
                    "winter": False,
                    "summer": True,
                },
                "available_periods": {
                    "day": True,
                    "night": False,
                },
            }
        }
    )


class CourseFull(CourseBase):
    requirement_text: str = Field(
        ..., description="Text describing the course requirements"
    )
    equivalent_courses: List[str] = Field(
        default_factory=list, description="List of equivalent courses"
    )
    prerequisite_courses: Optional[List[str]] = Field(
        default_factory=list, description="List of prerequisite courses"
    )
    concomitant_courses: Optional[List[str]] = Field(
        default_factory=list, description="List of concomitant courses"
    )

    @computed_field
    @property
    def udem_website(self) -> str:
        return f"https://admission.umontreal.ca/cours-et-horaires/cours/{self.code}-{self.number}/"

    @property
    def code(self) -> str:
        return self.id[:3]

    @property
    def number(self) -> str:
        return self.id[3:]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "IFT2255",
                "name": "Génie logiciel",
                "description": "Introduction au génie logiciel. Cycles de développement. Analyse, modélisation et spécification. Conception. Développement orienté objet. Mise au point. Outils et environnements de développement.",
                "credits": 3,
                "cycle": 1,
                "available_terms": {
                    "autumn": True,
                    "winter": False,
                    "summer": True,
                },
                "available_periods": {
                    "day": True,
                    "night": False,
                },
                "prerequisites_courses": ["IFT1025"],
                "concomitant_courses": [],
                "equivalent_courses": [],
                "udem_website": "https://admission.umontreal.ca/cours-et-horaires/cours/ift-2255/",
            }
        }
    )
