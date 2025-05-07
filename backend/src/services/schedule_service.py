from src.db.models.schedule_model import Schedule
import logging
from typing import List
from ics import Calendar, Event
from ics.grammar.parse import ContentLine
from datetime import datetime, timedelta
import pytz
import os, sys

pattern_path = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "./../../parser")
)
sys.path.append(pattern_path)
from utils.pattern import Pattern

logger = logging.getLogger(__name__)


class ScheduleService:

    @staticmethod
    async def get_schedules_from_id(id_list: List[str]):
        """
        input : A list of schedule_id = [ "A24IFT1005", "H25MAT1400", ... ]
        output : A list of schedule object
        """
        try:
            query = dict()
            if len(id_list) > 0:
                query.update({"_id": {"$in": id_list}})

            return await Schedule.find(query).to_list()
        except Exception as e:
            logger.error(f"Error fetching schedule of {id_list=}:\n {e}")

    @staticmethod
    async def get_schedules_from_list(sigle_list: List[str], min_semester=None):
        """
        input parameter:
            - sigle_list : A list of course sigle = [ "IFT1005", "MAT1400", ... ]
            - min_semester: A int representing the minimum semester to be included.
              To transforme a semester (A24) to its int equivalent, use 'backend.parser.util.pattern.semester2int(min_semester)'

        output : A list of schedule object
        """
        try:
            query = dict()
            if len(sigle_list) > 0:
                query.update({"sigle": {"$in": sigle_list}})

            if min_semester is not None:
                assert type(min_semester) == int, "min_semester need to be in an int"
                query.update({"semester_int": {"$gte": min_semester}})

            return await Schedule.find(query).to_list()
        except Exception as e:
            logger.error(f"Error fetching schedule of {sigle_list=}:\n {e}")

    @staticmethod
    async def get_all_schedules(min_semester=None):
        try:
            query = dict()
            if min_semester:
                query.update({"semester_int": {"$gte": min_semester}})
            return await Schedule.find(query).to_list()
        except Exception as e:
            logger.error(f"Error fetching all schedules")
            raise

    # Ceci reçoit un list de schedules_ids. Un schedule_id ici est un id comme retrouvé
    # dans la db de schedule avec une lettre concaténée à la fin spécifiant la section du cours voulu`
    @classmethod
    async def get_ics(self, schedule_ids):
        cal = Calendar()
        tz = pytz.timezone("America/Montreal")
        real_ids = [id[:-1] for id in schedule_ids]
        schedules = await self.get_schedules_from_id(real_ids)
        print(schedules)
        for i, schedule in enumerate(schedules):
            for section in schedule.sections:
                # La première lettre de la section (A et A101 ont la même lettre) doit correspondre `
                # à la lettre demandée.`
                # On ne différentie pas les différents volets d'une même section.
                if section["name"][0] != schedule_ids[i][-1]:
                    continue
                for volet in section["volets"]:
                    for event_data in volet["activities"]:
                        start_datetime = tz.localize(
                            datetime.strptime(
                                f"{event_data['start_date']} {event_data['start_time']}",
                                "%Y-%m-%d %H:%M",
                            )
                        )

                        end_datetime = tz.localize(
                            datetime.strptime(
                                f"{event_data['start_date']} {event_data['end_time']}",
                                "%Y-%m-%d %H:%M",
                            )
                        )

                        days = ",".join(
                            [Pattern.jour_to_day(jour) for jour in event_data["days"]]
                        ).upper()
                        event = Event()
                        event.created = datetime.now()
                        event.name = schedule.sigle + "(" + volet["name"] + ")"
                        event.duration = 100
                        event.begin = start_datetime
                        event.end = end_datetime
                        event.location = f"{event_data['pavillon_name']}, {event_data['room']}, {event_data['place']}"
                        event.description = f"Mode: {event_data['mode']}\nCampus: {event_data['campus']}"
                        until = event_data["end_date"].replace("-", "") + "T235959Z"
                        rrule = ContentLine(
                            name="RRULE",
                            value=f"FREQ=WEEKLY;BYDAY={days};UNTIL={until}",
                        )
                        event.extra.append(rrule)
                        cal.events.add(event)
        return cal.serialize()
