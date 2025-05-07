import logging

# FastAPI and middleware imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Database initialization
from src.db.init_db import init_db

# Application settings and router
from src.core.config import settings
from src.api.v1 import router


"""
Main application initialization for Planner.
Sets up FastAPI application, CORS middleware, and initializes the database connection.
"""

description = """
# API Documentation

This project is currently in development. The source code is available on [GitHub](https://github.com/udem-diro/Planificateur-academique).

- Explore and test the API endpoints using the [**Swagger UI**](https://planner-api.onrender.com/docs).
- Use the [**ReDoc**](https://planner-api.onrender.com/redoc) interface for an alternative view of the API documentation.
"""

log = logging.getLogger(__name__)
# logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    app.mongodb_client = await init_db()
    yield
    # Shutdown code
    app.mongodb_client.close()


app = FastAPI(
    title=settings.PROJECT_NAME,
    summary="The project is a web application designed to help students plan their academic path.",
    description=description,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
    debug=True,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True, log_level=logging.INFO)
