from typing import List, Optional, Union
from pydantic import AnyHttpUrl
from decouple import config
from pydantic_settings import BaseSettings

"""
This module defines the application's configuration settings using environment variables and default values.
"""


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = config(
        "BACKEND_CORS_ORIGINS", cast=lambda v: v.split(",")
    )
    BASE_URL: str = config("BASE_URL", cast=str)
    PROJECT_NAME: str = "Planificateur académique"
    VERSION: str = "0.1.0"

    # Database
    MONGO_CONNECTION_STRING: str = config("MONGO_CONNECTION_STRING", cast=str)
    MONGO_DB_NAME: str = config("MONGO_DB_NAME", cast=str)
    CONNECTION_TIMEOUT: int = 5000  # in milisecond


settings = Settings()
