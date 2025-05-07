import { IDepartment } from "../../models/department";
import { IFaculty } from "../../models/faculty";
import { IProgram } from "../../models/program";
import { IOrientation } from "../../models/orientation";
import { AvailableTermsKeys } from "../../models/availableTerms";

export const getDefaultSchoolFilters = (
  faculties: IFaculty[],
  defaultProgramId: string,
  defaultOrientationId: string
) => {
  let facultyId = "",
    departmentId = "",
    programId = defaultProgramId;

  if (defaultProgramId)
    ({ facultyId, departmentId } = findFacultyAndDepartmentByProgramId(
      faculties,
      defaultProgramId
    ));

  if (!defaultProgramId || !facultyId || !departmentId) {
    facultyId = getDefaultSelectedFaculty(faculties);
    departmentId = getDefaultSelectedDepartment(facultyId, faculties);
    programId = getDefaultSelectedProgram(departmentId, faculties);
  }

  const orientation = getDefaultSelectedOrientation(
    programId,
    defaultOrientationId,
    faculties
  );
  return { facultyId, departmentId, programId, orientation };
};

export const getDefaultSelectedFaculty = (faculties: IFaculty[]) => {
  return faculties.length > 0 ? faculties[0]._id : "";
};

export const getDefaultSelectedDepartment = (
  facultyId: string,
  faculties: IFaculty[]
) => {
  const departments = getDepartmentsOfFaculty(facultyId, faculties);
  const defaultDepartment = !!departments.length ? departments[0]._id : "";
  return defaultDepartment;
};

export const getDefaultSelectedProgram = (
  departmentId: string,
  faculties: IFaculty[]
) => {
  const programs = getProgramsByDepartment(departmentId, faculties);
  const defaultProgram = !!programs.length ? programs[0]._id : "";

  return defaultProgram;
};

export const getDefaultSelectedOrientation = (
  programId: string,
  defaultOrientationId: string,
  faculties: IFaculty[]
): IOrientation | null => {
  const programOrientations = getOrientationsByProgram(programId, faculties);

  // If default orientation exists and it's valid, return it
  if (defaultOrientationId) {
    const orientation = programOrientations.find(
      (orientation) => orientation._id === defaultOrientationId
    );

    if (!!orientation) return orientation;
  }

  // Otherwise, return the first orientation of the program
  return programOrientations.length > 0 ? programOrientations[0] : null;
};

export const getProgramsByDepartment = (
  departmentId: string,
  faculties: IFaculty[]
): IProgram[] => {
  for (const faculty of faculties) {
    const department = faculty.departments.find(
      (dep) => dep._id === departmentId
    );
    if (department) {
      return department.programs;
    }
  }
  return [];
};

export const getOrientationsByProgram = (
  programId: string,
  faculties: IFaculty[]
): IOrientation[] => {
  const defaultOrientation = [aucune_orientation(programId)];
  for (const faculty of faculties) {
    for (const department of faculty.departments) {
      for (const program of department.programs) {
        if (program._id === programId) {
          // --start-- temporary to get the right format
          const programOrientations = parseToOrientation(program.orientation);
          // --end-- temporary to get the right format

          return [...programOrientations, ...defaultOrientation];
        }
      }
    }
  }
  // If no program is found with the given programId, return default orientation
  return defaultOrientation;
};

export const getDepartmentsOfFaculty = (
  facultyId: string,
  faculties: IFaculty[]
): IDepartment[] => {
  const faculty = faculties.find((fac) => fac._id === facultyId);
  if (faculty) {
    return faculty.departments;
  }
  return [];
};

function findFacultyAndDepartmentByProgramId(
  faculties: IFaculty[],
  programId: string
): { facultyId: string; departmentId: string } {
  for (const faculty of faculties) {
    for (const department of faculty.departments) {
      const program = department.programs.find(
        (prog) => prog._id === programId
      );
      if (program) {
        return { facultyId: faculty._id, departmentId: department._id };
      }
    }
  }

  return { facultyId: "", departmentId: "" };
}

/// This is temporary, to convert returned url-like orientation to IOrientation[]
export const parseToOrientation = (urls: any): IOrientation[] => {
  return urls.map((url: string) => {
    // Split the URL by "/" to separate the components
    const parts = url.replace(/_/g, " ").split("/");

    // Extract the program ID, orientation name, and segments
    const programId = parts[3];
    const orientationName = decodeURIComponent(parts[4]); // decodeURIComponent to handle any special characters in the name
    const semestersString = parts[5];
    const segmentsString = parts[6];

    // Split the semesters by "*"
    const semestersArray = semestersString.split("*");

    // Split the segments by ","
    const segmentsArray = segmentsString.split(",");

    // Parse the semesters into the correct format
    const semesters = semestersArray.map((semesterStr, index) => {
      const courses = semesterStr
        .split(",")
        .filter((courseBlockPair) => courseBlockPair.trim() !== "") // Filter out any empty courseBlockPair
        .map((courseBlockPair) => {
          const [courseId, blockId] = courseBlockPair.split(";");
          return { courseId, blockId };
        });

      // Determine the season based on the index
      const season =
        index % 3 === 0
          ? AvailableTermsKeys.Autumn
          : index % 3 === 1
          ? AvailableTermsKeys.Winter
          : AvailableTermsKeys.Summer;

      return {
        season,
        courses,
        description: "",
      };
    });

    return {
      _id: "general_orientation_id",
      name: orientationName,
      segments: segmentsArray,
      semesters,
    };
  });
};

const aucune_orientation = (programId: string): IOrientation => ({
  _id: `aucune_orientation_id_${programId}`,
  name: "Aucune Orientation",
  segments: [],
  semesters: [
    {
      season: AvailableTermsKeys.Autumn,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Winter,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Summer,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Autumn,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Winter,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Summer,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Autumn,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Winter,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Summer,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Autumn,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Winter,
      courses: [],
      description: "",
    },
    {
      season: AvailableTermsKeys.Summer,
      courses: [],
      description: "",
    },
  ],
});
