from beanie import Document
from pydantic import Field
from typing import List, Optional, Union
from pydantic import field_validator, BaseModel, Field, HttpUrl


class Program(BaseModel):
    id: str = Field(..., alias="_id", description="Unique identifier of the program.")
    name: str = Field(..., description="Name of the program.")
    orientation: List[str] = Field(
        ..., description="List of the url corresponfing to an orientation"
    )

    """
    departments: Optional[List[str]] = Field(
        default_factory=list, description="Departments associated with the program."
    )
    """


class Department(BaseModel):
    id: str = Field(
        ..., alias="_id", description="Unique identifier of the department."
    )
    name: str = Field(..., description="Name of the department.")
    programs: List[Program] = Field(
        ..., description="List of the programs in a department."
    )


class Faculty(Document):
    id: str = Field(..., alias="_id", description="Unique identifier of the faculty.")
    name: str = Field(..., description="Name of the faculty.")
    departments: List[Department] = Field(
        ..., description="List of department for the faculty"
    )
    """# for futur, ounce we have a better way to construct de faculties structure
    # programs: List[Program] = Field(..., description="List of programs for the faculty")
    """

    class Settings:
        name: str = "faculties"
