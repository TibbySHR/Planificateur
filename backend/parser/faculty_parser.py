import json, re, csv, argparse, os
from string import ascii_letters, digits

alphanum = ascii_letters + digits

delimiter = ","


def parse(file_path, dest_path=None):
    with open(file_path, "r", encoding="utf-8") as f:
        # pass the weird none caracter leading in the first bits of the files (windows artefact)
        while f.read(1) not in alphanum:
            pass  # remove broken none-car leading the file
        f.seek(f.tell() - 1)

        reader = csv.DictReader(f)

        faculties = dict()

        for row in reader:

            faculty_id = row["Faculté - Identifiant"].strip().zfill(2)
            faculty_name = row["Faculté - Description"].strip()
            department_id = row["Département - Identifiant"].strip().zfill(4)
            department_name = row["Département - Description"].strip()
            program_id = row["Identifiant"].strip()
            program_name = row["Description"].strip()

            faculty = faculties.setdefault(faculty_id, dict())
            faculty["name"] = faculty_name
            faculty["_id"] = faculty_id

            departments = faculty.setdefault("departments", dict())

            department = departments.setdefault(department_id, dict())

            # remove options from name

            department["name"] = department_name
            department["_id"] = department_id

            programs = department.setdefault("programs", dict())

            program = programs.setdefault(program_id, dict())

            if re.search(r"[oO]ption", program_name):
                program_name = re.split("[oO]ption", department_name)[0]
                program_name = department_name.rsplit(" - ", 1)[0]

                # delete arthefact  caracters and the end like space or comma
                i = len(program_name)
                while program_name[i - 1] not in alphanum:
                    i -= 1
                program_name = department_name[:i]
            program["name"] = program_name
            program["_id"] = program_id

        """
        Only one exception from the source document is the master and doctorate in 
        DIRO that are togheter in the document, we need to manually split them
        """
        if "217510 - 317510" in faculties["03"]["departments"]["0340"]["programs"]:
            program = faculties["03"]["departments"]["0340"]["programs"].pop(
                "217510 - 317510"
            )
        faculties["03"]["departments"]["0340"]["programs"]["217510"] = {
            "_id": "217510",
            "name": "Maîtrise en informatique",
        }
        faculties["03"]["departments"]["0340"]["programs"]["317510"] = {
            "_id": "317510",
            "name": "Doctorat en informatique",
        }

        # Now we need to transform dict into list
        for faculty in faculties.values():

            for department in faculty["departments"].values():
                department["programs"] = [
                    program for program in department["programs"].values()
                ]
            faculty["departments"] = [
                department for department in faculty["departments"].values()
            ]
        faculties = [faculty for faculty in faculties.values()]

        if dest_path is not None:
            file_name = file_path.rsplit("/", 1)[-1].rsplit(".", 1)[0]
            dest_path_name = dest_path + file_name + "_parsed.json"
            with open(dest_path_name, "w", encoding="utf-8") as f:
                f.write(json.dumps(faculties))

        return faculties


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Parse the raw csv data and create faculties structure"
    )
    parser.add_argument(
        "--file_path",
        type=str,
        help="the source file path",
        default=os.path.join("..", "data", "faculty", "faculty.csv"),
    )
    parser.add_argument(
        "--dest_path",
        type=str,
        help="is the destination directory to write the result",
        default=os.path.join("..", "data", "faculty"),
    )
    args = parser.parse_args()
    parse(args.file_path, args.dest_path)
