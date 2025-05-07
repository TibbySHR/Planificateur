from src.db.models.program_model import Program
from src.db.models.course_model import Course
from src.db.models.schedule_model import Schedule
from src.services.course_service import CourseService
from src.services.program_service import ProgramService
from datetime import datetime
from typing import List, Literal, Union, Set
from fastapi import HTTPException
import logging
import asyncio
import re
import traceback
from dataclasses import dataclass
from string import ascii_letters, digits
from pydantic import BaseModel, Field
from . import Ast_parser

alphanum = ascii_letters + digits + "àâäçéèêëîïôöùûüÿœæ"
logger = logging.getLogger(__name__)


class SearchForm(BaseModel):
    collection: str = Field(..., description="One of the collections to be searched.")
    query: dict = Field(..., description="The query to be fed to pymongo collection.")
    season: str = Field(
        ..., description="The season at which the schedule are requested."
    )


def getThisSeason():
    current_year = datetime.now().year % 100
    current_month = datetime.now().month
    if current_month in range(1, 5):
        thisSeason = "H"
    elif current_month in range(5, 9):
        thisSeason = "E"
    else:
        thisSeason = "A"
    thisSeason += str(current_year)
    return thisSeason


class SearchService:

    @staticmethod
    async def searchForm2Schedule(searchForm: SearchForm):
        """
        This function transforme a SearchForm into, a set of sigle but sending the queries to
        the appropriate database.
        """
        # For faster request, use directly the db without Beanie projection.
        database = Schedule.get_motor_collection()
        if searchForm is None:
            return set()

        if searchForm.collection == "programs":
            pipeline = [
                {"$match": searchForm.query},
                {"$project": {"courses": 1, "_id": 0}},
                {"$unwind": "$courses"},
                {"$group": {"_id": None, "course_ids": {"$addToSet": "$courses"}}},
            ]

            result = (
                await Program.get_motor_collection()
                .aggregate(pipeline)
                .to_list(length=1)
            )

            if result:
                course_ids = result[0]["course_ids"]
                course_ids = [searchForm.season + id for id in course_ids]
            else:
                course_ids = []

            scheduleDocs = await database.find(
                {"_id": {"$in": course_ids}}, {"_id": 1}
            ).to_list()
            return set(schedule["_id"] for schedule in scheduleDocs)

        elif searchForm.collection == "courses":
            courseDocs = (
                await Course.get_motor_collection()
                .find(searchForm.query, {"_id": 1})  # retrieve only the id.
                .to_list()
            )
            if courseDocs:
                course_ids = [
                    searchForm.season + course["_id"] for course in courseDocs
                ]
            else:
                course_ids = []

            scheduleDocs = await database.find(
                {"_id": {"$in": course_ids}}, {"_id": 1}
            ).to_list()
            return set(schedule["_id"] for schedule in scheduleDocs)

        else:
            docs = await database.find(searchForm.query, {"_id": 1}).to_list()
            return set(doc["_id"] for doc in docs)

    @staticmethod
    async def runSchedulePipeline(pipeline: List[dict]):
        "Mini function to allow parallelization."
        array = (
            await Schedule.get_motor_collection().aggregate(pipeline).to_list(length=1)
        )
        return array

    @staticmethod
    async def searchAdvanced(query_str, season=None):
        """
        This function receive de advanced query_str supposed to be an AST (abstract syntax tree).
        If at any point it detect an error ( bad AST, bad caracters ) it return error 400 'Invalid AST input'.
        Which provoke the front-end to show an alert.

        Behavior:
        Transforme the 'mot' token into sets of sigle, on which the set operations according to the AST are done.
        The resulting set of sigle is then used to retrive the schedule from the schedules database.
        """
        # BE CAREFULL about what caracter are added into the sanitization of the query_str
        # as it can lead to regex injection and security problem.
        accepted_caracters = alphanum + r'()\\:&" '
        query_str = query_str.replace("-", "")

        for car in query_str:
            if car not in accepted_caracters:
                raise HTTPException(status_code=400, detail="Invalid AST input")

        if season is None:
            # Construct the current season, like A24
            season = getThisSeason()
        else:
            assert re.match(r"^[aehAEH]\d{2}$", season)

        wordPattern = r'\w+:"[^"]*"|\w+:\w+|\w+'
        astPattern = r"[()&\\]"
        pattern = wordPattern + "|" + astPattern
        tokens = re.findall(pattern, query_str)
        print(tokens)

        # Transform word token into empty set for AST structure testing.
        testTokens = [token if (token in astPattern) else set() for token in tokens]
        # Before parsing the word token into set, assert that the input
        # is a valid AST. We don't want to do queries if not a valid AST.
        try:
            ast = Ast_parser.parse(testTokens)
        except Exception as e:
            print("Not a valid AST input")
            # If the query_str is not a correct ast, return nothing.
            raise HTTPException(status_code=400, detail="Invalid AST input")

        searchForms = []
        sectionSpecifications = []
        for index, token in enumerate(tokens):
            if m := re.match(wordPattern, token):
                word = m[0]
                searchForms.append(
                    (index, SearchService.word2SearchForm(token, season))
                )
                if m := re.match(r"^([A-Za-z]{3}\d{4})([a-zA-Z])$", word):
                    sigle = m[1].upper()
                    section = m[2].upper()
                    sectionSpecifications.append((sigle, section))

        # Parallelize the query.
        sets = await asyncio.gather(
            *(SearchService.searchForm2Schedule(form) for index, form in searchForms)
        )
        for (index, _), result_set in zip(searchForms, sets):
            tokens[index] = result_set

        ast = Ast_parser.parse(tokens)

        final_schedule_ids = Ast_parser.evaluate(ast)

        sectionTruncatedPipeline = []
        for sigle, section in sectionSpecifications:
            if season + sigle in final_schedule_ids:
                final_schedule_ids.remove(season + sigle)
                pipeline = [
                    {"$match": {"_id": season + sigle}},
                    {
                        "$addFields": {
                            "sections": {
                                "$filter": {
                                    "input": "$sections",
                                    "as": "section",
                                    "cond": {
                                        "$regexMatch": {
                                            "input": "$$section.name",
                                            "regex": "^" + section,
                                            "options": "i",
                                        }
                                    },
                                }
                            }
                        }
                    },
                ]
                sectionTruncatedPipeline.append(pipeline)

        print(
            "Cardinality of Advanced Search :",
            len(final_schedule_ids) + len(sectionTruncatedPipeline),
        )

        scheduleComplete = await Schedule.find(
            {"_id": {"$in": final_schedule_ids}}
        ).to_list()

        # For each course token  that had a section (IFT1005A), go fetched a truncated schedule.
        task = [
            SearchService.runSchedulePipeline(pipeline)
            for pipeline in sectionTruncatedPipeline
        ]
        scheduleTruncatedLists = await asyncio.gather(*task)
        seenScheduleTruncatedId = set()
        scheduleTruncated = []
        # This ensure that there is no duplication if two course token with section were the same.
        for scheduleTruncatedList in scheduleTruncatedLists:
            if (
                scheduleTruncatedList
                and scheduleTruncatedList[0]["_id"] not in seenScheduleTruncatedId
            ):
                seenScheduleTruncatedId.add(scheduleTruncatedList[0]["_id"])
                scheduleTruncated.append(scheduleTruncatedList[0])
        return scheduleComplete + scheduleTruncated

    @staticmethod
    def word2SearchForm(mot, season):
        """
        This function transforme a "mot" token from a advanced search string into a SearchForm.
        It interpret the semantic of the syntax of a 'mot' to transform it into a query.
        Exemple of a 'mot' :
            - ens:robin
            - name:"prog dyn"
            - ift1
            - etc

        This can be extented as we want to allow more interpretation of the word permitted in
        a advanced search string.
        """
        # BE CAREFULL about what caracter are added into the sanitization of 'mot'
        # as it can lead to regex injection and security problem.
        mot = "".join([car for car in mot if car in alphanum + ' :"'])
        # This match programs id, without season.
        # Minimum 4 digits to maximum 6 digits.
        if re.match(r"^\d{4,6}$", mot):
            return SearchForm(
                collection="programs",
                query={"_id": {"$regex": mot + ".*", "$options": "i"}},
                season=season,
            )

        # This match courses sigle/id,  without season.
        # Exactly 3 caracters (IFT), then 0 to 4(max) numbers.
        # Has an optional section at the end
        elif m := re.match(r"^([A-Za-z]{3}\d{0,4})[a-zA-Z]?$", mot):
            sigle = m[1]
            return SearchForm(
                collection="schedules",
                query={"_id": {"$regex": season + sigle + ".*", "$options": "i"}},
                season=season,
            )
        elif m := re.match(r'^credits?:(?:"(\d{1,2})"|(\d{1,2}))$', mot):
            credits = m[1] or m[2]
            credits = int(credits)
            return SearchForm(
                collection="courses", query={"credits": credits}, season=season
            )
        elif m := re.match(r'^name:(?:"([^"]{3,})"|(\w{3,}))$', mot):
            name = m[1] or m[2]
            name = ".*" + ".*".join(name.split()) + ".*"
            return SearchForm(
                collection="courses",
                query={"name": {"$regex": name, "$options": "i"}},
                season=season,
            )

        elif m := re.match(r'^description:(?:"([^"]{3,})"|(\w{3,}))$', mot):
            description = m[1] or m[2]
            description = ".*" + ".*".join(description.split()) + ".*"
            return SearchForm(
                collection="courses",
                query={"description": {"$regex": description, "$options": "i"}},
                season=season,
            )

        # Accepted ens:"word word word", ens:word, ens:"word"
        elif m := re.match(r'^ens:(?:"([^"]{3,})"|(\w{3,}))$', mot):
            prof = m[1] or m[2]
            profs = prof.split()
            # if prof = "robin mil", check in the db for ( "mil robin" OR "robin mil" )
            if len(profs) == 2:
                pattern = ".*" + ".*".join(profs) + ".*"
                queryOne = {"sections.teachers": {"$regex": pattern, "$options": "i"}}
                pattern = ".*" + ".*".join(profs[::-1]) + ".*"
                queryTwo = {"sections.teachers": {"$regex": pattern, "$options": "i"}}
                query = {"$or": [queryOne, queryTwo]}
            else:
                pattern = ".*" + ".*".join(profs) + ".*"
                query = {"sections.teachers": {"$regex": pattern, "$options": "i"}}

            return SearchForm(
                collection="schedules",
                query=query,
                season=season,
            )
        elif m := re.match(r'^pre:(?:"([^"]{3,})"|(\w{3,}))$', mot):
            word = m[1] or m[2]
            word = ".*" + ".*".join(word.split()) + ".*"
            return SearchForm(
                collection="courses",
                query={"prerequisite_courses": {"$regex": word, "$options": "i"}},
                season=season,
            )
        elif m := re.match(r'^con:(?:"([^"]{3,})"|(\w{3,}))$', mot):
            word = m[1] or m[2]
            word = ".*" + ".*".join(word.split()) + ".*"
            return SearchForm(
                collection="courses",
                query={"concomitant_courses": {"$regex": word, "$options": "i"}},
                season=season,
            )

        elif m := re.match(r'^equ:(?:"([^"]{3,})"|(\w{3,}))$', mot):
            word = m[1] or m[2]
            word = ".*" + ".*".join(word.split()) + ".*"
            return SearchForm(
                collection="courses",
                query={"equivalent_courses": {"$regex": word, "$options": "i"}},
                season=season,
            )
        else:
            print("doesn't match", mot)
            raise HTTPException(status_code=400, detail="Invalid AST input")
