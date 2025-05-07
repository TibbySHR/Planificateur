# Backend

The Planner backend relies mainly on **FastAPI** (Python framework) to handle the application requests (API) and **MongoDB** to manage the data.

- [Backend](#backend)
  - [Project structure 🗂️](#project-structure-️)
  - [Getting started 🔔](#getting-started-)
    - [Prerequisites 📋](#prerequisites-)
    - [Installation 💻](#installation-)
      - [1. Activate the virtual environment](#1-activate-the-virtual-environment)
      - [2. Install the project dependencies](#2-install-the-project-dependencies)
    - [Configuration 🔧](#configuration-)
  - [Running the API 🚀](#running-the-api-)
    - [1. Activate the virtual environment](#1-activate-the-virtual-environment-1)
    - [2. Start the FastAPI application](#2-start-the-fastapi-application)
    - [3. Access the API](#3-access-the-api)
  - [Testing 🎯](#testing-)

  
## Project structure 🗂️

The project follows the following structure:

```ada
/ -- Root (/backend)
├── src/ -- Source code of the API
│   ├── api/ -- Contains the API routes for different versions.
│   │   ├── v1/
│   │   │   ├── endpoints/ -- Contains endpoint definitions.
│   │   │   │   ├── courses.py
│   │   │   │   ├── faculties.py
│   │   │   │   ├── programs.py
│   ├── core/ -- Core configurations and security settings.
│   ├── db/ -- Database related files.
│   │   ├── models/ -- Database models.
│   │   │   ├── course.py
│   │   │   └── program.py
│   │   └── init_db.py -- Database initialization.
│   ├── schemas/ -- Pydantic models used to parse/validate incoming requests and return responses.
│   │   └── course_schema.py
│   ├── services/ -- Application business logic, layer between the API and the database.
│   │   ├── course_service.py
│   │   ├── faculty_service.py
│   │   └── program_service.py
│   ├── tests/ -- Unit and integration tests.
│   │   ├── v1/
│   │   │   ├── test_courses.py
│   │   │   └── test_faculties.py
│   │   └── test_main.py
│   └── .env
│   └── main.py -- Entry point of the FastAPI application.
├── test/ -- Unit and integration tests.
├── Dockerfile
├── Pipfile
├── requirements.txt
└── README.md
```

## Getting started 🔔

### Prerequisites 📋

Before you begin, ensure you have the following installed:

- Python 3.11+
- pip package manager
- **`pipenv`** &ndash; If not already installed, install it with the following command:

```sh
pip install pipenv
```

> Pipenv is a Python virtualenv management tool that supports a multitude of systems and nicely bridges the gaps between pip, python (using system python, pyenv or asdf) and *virtualenv*.   
Linux, macOS, and Windows are all first-class citizens in pipenv.

### Installation 💻

These steps ensure that you have all the dependencies installed and up to date.

#### 1. Activate the virtual environment

```sh
pipenv shell
```

#### 2. Install the project dependencies

> 👉 This step is only necessary when **installing for the first time** or when **adding new dependencies**.

```sh
pipenv install -r requirements.txt
```

This command installs all the dependencies listed in the file `requirements.txt`.

### Configuration 🔧

> The `.env` file is used to manage environment-specific configuration settings and sensitive information for the application (eg. database connection strings, API keys...). 

Create an `.env` file in the `/src` directory with the following variables:

```
BACKEND_CORS_ORIGINS="http://localhost:27017"
MONGO_CONNECTION_STRING=<MONGO_DB_CONNECTION_STRING> # "mongodb://localhost:27017/" <-- for local running instances 
MONGO_DB_NAME="planner"
BASE_URL=<BASE_URL> # "http://localhost:8000" <-- for local running instances
```

## Running the API 🚀

> These steps assume that you have previously installed the dependencies.

### 1. Activate the virtual environment

If the virtual environment is not already activated, run the following command from the `/api` (root) folder:

```sh
pipenv shell
```

### 2. Start the FastAPI application

From  the `/api` (root) folder, run the following command:

```sh
uvicorn src.main:app --reload
```

This command starts the FastAPI application with automatic reloading enabled for development purposes.
-  The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).
-  The automatic documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) or [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc).

### 3. Access the API

Navigate to http://localhost:8000/docs in your browser to view the Swagger UI documentation and interact with the API endpoints.

## Testing 🎯

1. In the `/src` folder, activate the virtual environement with `pipenv shell`.
2. Run the tests with the following command:

```sh
pytest
```

This command runs all the tests in the `/tests` directory.
