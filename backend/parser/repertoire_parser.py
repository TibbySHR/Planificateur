import sys, os, re, json, subprocess
import logging
from utils.pattern import Pattern
from pprint import pprint

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# -------------program parameters--------------------

pattern = Pattern()

sigle_id_pattern = pattern.sigle_id_pattern
cours_id_pattern = r"[cC]ours? ?: ?\d{6}"
date_pattern = r"\d{4}/(0[0-9]|1[0-2])/(3[01]|[12][0-9]|[1-9]|0)"
types_pattern = r"([pP]réalables?|[cC]oncomitants?|[éÉ]quivalents?) ?:"
stopping_string_pattern = r"([hH]abituellement offert|Volets?|[aA]ttributs?|[gG]roupe exigences?|[pP]réalables?|[cC]oncomitants?|[éÉ]quivalents?) ?:"
float_pattern = pattern.float_pattern

standarize_sigle = pattern.standarize_sigle

# ---------------To do----------------------------------

# TODO wish-list add logic separation


# -------------------------------------------------


def parse(source_file_path, dest_path=None):

    try:
        # verify if the source_file_path exist
        if not os.path.isfile(source_file_path):
            raise ValueError("The file: " + source_file_path + "\ndoesn't exist")

        # transform the pdf to txt using pdftotxt tools and catch the text in the stdout
        pdftotext = subprocess.run(
            f"pdftotext -raw {source_file_path} - ",
            capture_output=True,
            text=True,
            shell=True,
            executable="/bin/bash",
        )
        if pdftotext.returncode != 0:
            raise ValueError("Failed to run pdftotext tool")

        # split the file into courses using the "_____" that separate them
        courses = re.split(r"_{4,}", pdftotext.stdout)

    except Exception as e:
        logger.error(f"Fatal : {str(e)}")
        sys.exit(1)

    repertoire = []

    for j, course in enumerate(courses):

        course = course.strip()
        lines = course.split("\n")
        i = 0

        # ------------ assure that we find a line with sigle and id
        # look for "Cours : 117209" pattern pour savoir si on est sur la ligne du sigle
        id_match = None
        sigle_match = None
        while i < len(lines):
            id_match = re.search(cours_id_pattern, lines[i])
            if id_match:  # if we find an id, we need to make sure there's also a sigle
                sigle_match = re.search(sigle_id_pattern, lines[i])
                if sigle_match:
                    break  # we found both id and sigle
            i += 1

        if not id_match or not sigle_match:  # if no id and sigle found in a course
            # Handling the end of file exception
            if j != len(courses) - 1:  # if it's not the end of file => error
                logger.error(
                    f"Error: pas de sigle+id trouvé, donc le cours suivant n'est pas processed:\n{course}"
                )
                continue
            else:
                break  # else its the end of file so break to terminate

        name = lines[i + 1].strip()
        # this regex detect float numbers
        if not (
            credit_match := re.search(
                r"\(" + float_pattern + r"\)",
                lines[i][sigle_match.end() : id_match.start()],
            )
        ):
            logger.error(
                f"Error: pas de credit trouvé, donc -1 est attribué:\n{lines[i]}"
            )
            credit = -1.0
        else:
            credit = float(credit_match[0][1:-1])

        i += 2  # set the index at the corect place to start description extraction

        # ---------standarize the sigle:

        sigle = standarize_sigle(sigle_match[0])

        # --------extract course description

        description = []
        while i < len(lines):
            line = lines[i]
            # while we are not in an other section, we append description
            if not re.search(stopping_string_pattern, line):
                description.append(line)
                i += 1
            else:
                break

        this_course = dict()
        repertoire.append(this_course)
        this_course["_id"] = sigle
        this_course["code"] = sigle[:3]  # IFT
        this_course["number"] = sigle[3:]  # 2015
        this_course["name"] = name
        this_course["credits"] = credit
        this_course["description"] = " ".join(description)
        this_course["available_terms"] = {
            "autumn": False,
            "winter": False,
            "summer": False,
        }
        this_course["available_periods"] = {"daytime": False, "evening": False}

        rest = "\n".join(lines[i:])

        # ----find the "habituellement offert" for terms availability------------

        terms = this_course["available_terms"]

        if match := re.search(r"[hH]abituellement ?[oO]ffert ?:", rest):
            # extract string until the end of line after the ":"
            string = rest[match.end() :].split("\n", 1)[0]
            if re.search(r"automne", string.lower()):
                terms["autumn"] = True
            if re.search(r"hiver", string.lower()):
                terms["winter"] = True
            if re.search(r"été", string.lower()):
                terms["summer"] = True

        # If no information about terms, they are arbitraly all set to True
        if not any(terms.values()):
            for term in ["autumn", "winter", "summer"]:
                terms[term] = True

        # ----find the "attribues" for periods availability------------

        periods = this_course["available_periods"]
        if match := re.search(r"[aA]ttributs?:", rest):
            # extract string until the end of line after the ":"
            string = rest[match.end() :].split("\n", 1)[0]
            if re.search(r"jour", string.lower()):
                periods["daytime"] = True
            if re.search(r"soir", string.lower()):
                periods["evening"] = True

        # If no information about periods, they are arbitraly all set to True
        if not any(periods.values()):
            for period in ["evening", "daytime"]:
                periods[period] = True

        # --------- extract the requirements -----------------
        # create a temporary data structure meant to be incorporate into this_course
        requirement = {
            "prerequisite_courses": set(),
            "concomitant_courses": set(),
            "equivalent_courses": set(),
            "requirement_text": {
                "prerequisite_courses": [],
                "equivalent_courses": [],
                "concomitant_courses": [],
            },
        }

        while type_match := re.search(types_pattern, rest):
            type = type_match[0]
            if re.match(r"[pP]réalables? ?:", type):
                type = "prerequisite_courses"
            elif re.match(r"[cC]oncomitants? ?:", type):
                type = "concomitant_courses"
            elif re.match(r"[éÉ]quivalents? ?:", type):
                type = "equivalent_courses"
            else:
                logger.error(
                    f"Error : This shouldn't ever happen, the type extracted doesn't correspond to anything"
                )
                continue

            # we extracted the type, we want the text after and extract just the exigences associated with this type
            rest = rest[type_match.end() :]
            # extract all the text until the next stopping string pattern
            if next_rest_match := re.search(stopping_string_pattern, rest):
                exigences_string = rest[: next_rest_match.start()]
                rest = rest[next_rest_match.start() :]
            else:
                exigences_string = rest
                rest = ""

            all_courses = set(
                map(standarize_sigle, re.findall(sigle_id_pattern, exigences_string))
            )
            requirement[type].update(all_courses)
            requirement["requirement_text"][type].append(exigences_string)

        # incorporate the temp "requirement" dict into this_course
        for type in [
            "prerequisite_courses",
            "concomitant_courses",
            "equivalent_courses",
        ]:
            this_course[type] = list(requirement[type])

        this_course["requirement_text"] = "\n".join(
            [
                type + " : " + " ".join(course_list)
                for type, course_list in requirement["requirement_text"].items()
                if len(course_list) != 0
            ]
        )

    if dest_path is not None:
        with open(dest_path, "w") as f:
            f.write(json.dumps(repertoire))
    return repertoire
