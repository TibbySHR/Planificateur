import sys, re, os, json
import logging
from utils.pattern import Pattern

logger = logging.getLogger(__name__)

"""
What it does:
    - Parse "Annuaire" of synchro containning all programme structure 
    - Serialise them into a json string file
    - json object structure available as an image on the documentation
"""
# ------script parameter-----------------#

pattern = Pattern()  # some standarize regex and method

# The pattern are meant to verify if the extracted string is the correct format
program_id_pattern = pattern.program_id_pattern  # r"^\d-\d{3}-\d-\d$"  # 1-175-1-0
flag_pattern = r"^<[A-Z]{3}>$"  # <GET>
segment_pattern = r"^Segments? [0-9A-Z]+$"
bloc_pattern = r"Bloc ?[0-9A-Z-]+"
sigle_id_pattern = pattern.sigle_id_pattern  # r"[A-Z]{3} ?\d{4}[a-zA-Z0-9]?"
semestrer_pattern = r"^(?=[AEH]*$)(?!.*(.).*\1)[AEH]*$"
float_pattern = pattern.float_pattern  # r"\d+(\.\d)?"
credit_type_pattern = r"([oO]bligatoires?|[Oo]ptions?|[cC]hoix|[cC]ours en ligne)"
credit_struct_pattern = float_pattern + " cr(e|é)dits?"

standarize_sigle = pattern.standarize_sigle

# ---------------------------------------#


# is the main function of the parser, you can skip writing the resulting object
# in a file by skipping giving it a destination_path. In both case, it return the
# python data structure that is .json correct.
def parse(source_file_path, destination_path=None):

    # Test if the one file_path is given, and if it exist
    try:
        if not os.path.isfile(source_file_path):
            raise ValueError("The file: " + source_file_path + "\ndoesn't exist")

        with open(source_file_path, "r", encoding="utf-8") as f:
            while f.read(1) != "<":
                pass  # remove broken none-car leading the file
            f.seek(f.tell() - 1)
            file = f.readlines()
            if len(file) > 0 and file[-1].isspace():
                file.pop()

    except Exception as e:
        logger.error(f"Fatal : {str(e)}")
        sys.exit(1)

    global i
    i = 0

    set_of_program_ids = set()  # meant for id verification
    programs = []  # Is the big json object

    while i < len(file):

        line = file[i]
        flag = line[0:5]

        match flag:
            case "<GET>":
                line = line.strip()
                id = line[5:14]

                # ---------id verification----------------
                is_id_error = False
                if not re.match(program_id_pattern, id):
                    logger.error(
                        f"Error {i}: The program id: '{id}' do not match the given pattern: {program_id_pattern}"
                    )
                    is_id_error = True
                elif id in set_of_program_ids:
                    logger.error(
                        f"Error {i}: The program id "
                        + id
                        + " has a duplicate, so this occurence is ignored"
                    )
                    is_id_error = True
                else:
                    set_of_program_ids.add(id)

                # if there is an id_error, skip to the next program
                if is_id_error:
                    i += 1
                    while not re.search(r"<GET>", file[i]) and i < len(file) != "<GET>":
                        i += 1
                    continue

                # --------------------------------------

                program = {"_id": id.replace("-", "")}
                programs.append(program)
                program["name"] = line[15:].strip()
                program["segments"] = []

            case "<TTG>":
                title = line[5:].strip()
                permitted_title = ["Objectif(s)", "Règlement"]
                if title not in permitted_title:
                    logger.error(
                        f"Fatal {i}: The title name '{title}' is not in the permitted list '{permitted_title}'"
                    )
                    logger.error(f"Fatal error parsing stopped")
                    sys.exit(1)
                i += 1
                line = file[i]
                flag = line[0:5]
                if flag != "<DTG>":
                    logger.error(
                        f"Fatel: A <TTG> is not followed by <DTG> at line {i} of file {source_file_path}"
                    )
                    sys.exit(1)

                program[title] = extract_text_flag(file, source_file_path)

            case "<GED>":
                program["structure"] = extract_text_flag(file, source_file_path)

            case "<ERT>":
                program["segments"].append(extract_one_segment(file, source_file_path))

            case _:
                if flag in ["<GTT>"]:
                    pass
                else:
                    logger.warning(f"line {i} not handled:{line}")
        i += 1

    # if their is a destination_path, write the .json file
    if destination_path is not None:
        json_data = json.dumps(programs)
        with open(destination_path, "w") as f:
            f.write(json_data)

    return programs


# return all the text following a flag, until a new flag is found
# ajust the i accordingly
def extract_text_flag(file, source_file_path):
    global i

    text = [file[i][5:]]

    # test = the next line is not out of file, and no flag <GET>
    while i + 1 < len(file) and not re.match(flag_pattern, file[i + 1][0:5]):
        text.append(file[i + 1])
        i += 1

    return "".join(text).strip()


# return the dict of a complete single segment, with its bloc and courses
# it ajust the i accordingly
def extract_one_segment(file, source_file_path):
    global i
    segment = dict()

    line = file[i]

    cut = line[5:].split(" ")
    try:
        segment["id"] = " ".join(cut[0:2]).strip()
        segment["name"] = " ".join(cut[2:]).strip()
    except Exception as e:
        logger.error(
            f"Fatal: Not enought field while parsing the segment at line {i} : \t{line}"
        )
        exit(1)

    if not re.match(segment_pattern, segment["id"]):
        logger.error(
            f"Fatal: The segment id '{segment['id']}' do not match the given pattern '{segment_pattern}'"
        )
        logger.error(f"Raw line: {line.strip()}")
        exit(1)

    if i + 1 < len(file) and file[i + 1][0:5] == "<ERD>":
        i += 1
        segment["description"] = extract_text_flag(file, source_file_path)
    else:
        segment["description"] = ""

    segment["blocs"] = []
    # extrat all the blocs
    while i + 1 < len(file) and file[i + 1][0:5] == "<ALT>":
        i += 1
        segment["blocs"].append(extract_one_bloc(file, source_file_path))

    return segment


# it adjust the i accordingly
# return the dict of a bloc
def extract_one_bloc(file, source_file_path):
    global i
    bloc = dict()
    line = file[i]

    alt_str = line[5:]
    bloc_id_match = re.search(bloc_pattern, alt_str)

    if bloc_id_match:
        bloc["id"] = bloc_id_match[0]
        bloc["name"] = alt_str[bloc_id_match.end() :].strip()
        bloc_pattern_is_matching = True

    else:
        bloc_pattern_is_matching = False
        bloc["name"] = ""
        bloc["id"] = ""
        bloc["description"] = alt_str.strip()

        logger.error(
            f"Error {i}: The bloc id '{bloc['id']}' do not match the given pattern '{bloc_pattern}' at line {i} of {source_file_path}'"
        )
        logger.error(f"Raw line: {line.strip()}")
        logger.info(
            f"The script will continue with those data extracted:\n\tname = ''\n\tbloc_id = ''\n\tbloc[description] = {bloc['description']} + <ALD_string>"
        )

    if i + 1 < len(file) and file[i + 1][0:5] == "<ALD>":
        # <ALD>Option - Minimum 9 crédits, maximum 18 crédits.\n[text]
        i += 1

        ALD_string = extract_text_flag(file, source_file_path).replace("\n\n", "\n")

        if bloc_pattern_is_matching:  # "description key doesn't exist
            bloc["description"] = ALD_string
        else:  # no bloc_pattern was found, "description" key allready exist
            bloc["description"] = bloc["description"] + ALD_string

        # line = ALD_string.split("\n")[0]
        line = ALD_string

        # normal regex pattern = obligatoire | choix | option | cours en ligne
        if credit_type := re.search(credit_type_pattern, line):
            bloc["type"] = credit_type[0]

            find_minmax = False
            # this form : Minimum 12 crédits, maximum 7 crédits
            if m := re.search(r"[mM]aximum \d\d? crédits", line):
                bloc["max"] = float(m[0].split(" ")[1])
                find_minmax = True
            if m := re.search(r"[mM]inimum \d\d? crédits", line):
                bloc["min"] = float(m[0].split(" ")[1])
                find_minmax = True

            if "max" in bloc and "min" not in bloc:
                bloc["min"] = 0.0

            if not find_minmax:
                # this form : "6 à 9 crédits"
                if credit_struct := re.search(r"^\d\d? à \d\d? crédit$", line):
                    credit_struct = credit_struct[
                        0
                    ].split()  # access the matched string
                    bloc["min"] = float(credit_struct[0])
                    bloc["max"] = float(credit_struct[2])

                # this form : "5 crédits"
                elif credit_struct := re.search(credit_struct_pattern, line):
                    credit_struct = credit_struct[
                        0
                    ].split()  # access the matched string
                    bloc["max"] = float(credit_struct[0])
                    bloc["min"] = float(credit_struct[0])

                else:  # no good form
                    logger.error(
                        f"Error {i} : No pattern is found work for bloc credit structure description:\n\tline : {line}\n"
                    )
                    bloc["min"], bloc["max"] = -1.0, -1.0
        else:
            logger.error(
                f"No credit_type_pattern '{credit_type_pattern}' were found in the line: \t {line}"
            )
            bloc["min"], bloc["max"], bloc["type"] = -1.0, -1.0, ""

        # to not have a bloc object with no min/max key , put "-1" to say no min/max where found
        for extrem in ["min", "max"]:
            if extrem not in bloc:
                bloc[extrem] = -1.0

    else:  # no <ALD> found
        if bloc_pattern_is_matching:  # "description key doesn't exist
            bloc["description"] = ""
        bloc["min"], bloc["max"], bloc["type"] = -1.0, -1.0, ""

    if i + 1 < len(file) and file[i + 1][0:5] == "<CRS>":
        i += 1
        bloc["courses"] = extract_all_courses(file, source_file_path)
    else:
        bloc["courses"] = []

    return bloc


def extract_all_courses(file, source_file_path):
    global i
    courses = []

    test = True  # if this function is called, we are allready on a "<CRS>" flag
    # so `test` is set to True by default
    parsing_error = False

    while test:
        course = dict()
        if parsing_error:
            if i + 1 < len(file) and file[i + 1][0:5] == "<CRS>":
                i += 1
                parsing_error = False
                continue

            else:
                test = False
                continue

        cut = file[i][5:].strip().split("\t")
        parsing_error = False
        if len(cut) != 5:
            logger.error(
                f"Error: Not enought field while parsing the course at line {i}, there should be 6 field: sigle, credit, semestrer, daytime, name. Correction: the course is skipped entirely. The not parsed line:\n{file[i]}"
            )
            parsing_error = True
            continue
        else:
            sigle, credit, semestrer, moment, name = cut[0:6]

        # verification of the extracted data follow the correct format
        if not re.match(sigle_id_pattern, sigle):
            logger.error(
                f"Error: The course sigle {sigle} do not match the given pattern {sigle_id_pattern} at line {i} of {source_file_path}. Correction, the course is skipped."
            )
            parsing_error = True
            continue
        if not re.match(float_pattern, credit):
            logger.error(
                f"Error: The course credit '{credit}' do not match the given pattern '{float_pattern}' at line {i} of {source_file_path}. Correction, the course is skipped."
            )
            parsing_error = True
            continue
        if moment not in ["J", "S", "JS", "SJ", ""]:
            logger.error(
                f'Error: The course moment \'{moment}\' do not match the given pattern \'["J","S","JS","SJ"]\' at line {i} of {source_file_path}Correction, the course is skipped.'
            )
            parsing_error = True
            continue

        sigle = standarize_sigle(sigle)
        course["_id"] = sigle
        course["code"] = sigle[:3]
        course["number"] = sigle[3:]
        course["credits"] = float(credit)
        course["name"] = name.strip()

        terms = course.setdefault(
            "available_terms", {"autumn": False, "winter": False, "summer": False}
        )
        periods = course.setdefault(
            "available_periods", {"daytime": False, "evening": False}
        )

        if "A" in semestrer:
            terms["autumn"] = True
        if "H" in semestrer:
            terms["winter"] = True
        if "E" in semestrer:
            terms["summer"] = True

        if "J" in moment:
            periods["daytime"] = True
        if "S" in moment:
            periods["evening"] = True

        courses.append(course)
        if i + 1 < len(file) and file[i + 1][0:5] == "<CRS>":
            i += 1
        else:
            test = False

    return courses
