from datetime import date


class Pattern:

    def __init__(self):
        self.semester_pattern = r"[HEA]\d{2}"
        self.sigle_id_pattern = r"[A-Z]{3} ?\d{4}[a-zA-Z0-9]?"
        self.date_pattern = r"\d{4}/(0[0-9]|1[0-2])/(3[01]|[12][0-9]|[1-9]|0)"  # iso
        self.float_pattern = r"\d+(\.\d+)?"
        self.program_id_pattern = r"^\d-\d{3}-\d-\d$"
        self.schedule_id = r"[HEA]\d{2}" + r"[A-Z]{3} ?\d{4}[a-zA-Z0-9]{0,2}"

    def standarize_sigle(self, sigle):
        space_at_index3 = sigle[3] == " "
        sigle = sigle[0:3].upper() + (sigle[4:] if space_at_index3 else sigle[3:])
        return sigle

    def get_this_semester():
        today = date.today()
        this_year = today.year % 100
        this_month = today.month
        if this_month in range(1, 5):
            this_sem = "H"
        elif this_month in range(5, 9):
            this_sem = "E"
        else:
            this_sem = "A"
        return this_sem + this_year

    def jour_to_day(jour):
        return {
            "Lu": "Mo",
            "Ma": "Tu",
            "Me": "We",
            "Je": "Th",
            "Ve": "Fr",
            "Sa": "Sa",
            "De": "Su",
        }.get(jour, "Mo")

    # meant for mongod, request by semester will be easier with a integer
    def semester2int(self, semester: str):
        assert len(semester) == 3
        assert semester[0] in "NHEA"
        foo = "NHEA".find(semester[0])
        return int(semester[1:] + "0") + foo

    def int2semester(self, semester_int: int):
        semester_str = str(semester_int)
        assert len(semester_str) == 3

        year = semester_str[:-1]
        sem_str = semester_str[-1]
        sem_int = int(sem_str)
        assert sem_int in range(4)

        sem = "NHEA"[sem_int]

        return sem + year

    def run_tests(self):
        assert self.int2semester(243) == "A24", f"Échoué : {self.int2semester(243)}"
        assert self.int2semester(302) == "E30"
        assert self.int2semester(981) == "H98"
        assert self.int2semester(980) == "N98"
        assert self.semester2int("E23") == 232
        assert self.semester2int("H98") == 981
        assert self.semester2int("A22") == 223

        print("All test passed")


if __name__ == "__main__":
    pattern = Pattern()
    pattern.run_tests()
