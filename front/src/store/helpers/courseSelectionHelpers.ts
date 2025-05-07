import { DropResult } from "react-beautiful-dnd";
import { ISemester } from "../../models/semester";
import { IProgram } from "../../models/program";
import { ISegment } from "../../models/segment";
import { ICourse } from "../../models/course";
import { AvailableTermsKeys } from "../../models/availableTerms";
import { IBlock } from "../../models/block";
import {
  constructSemestersBasedonURL,
  parseTermsInUrl,
} from "../../utils/helpers/url";
import { IOrientation } from "../../models/orientation";

export const deleteAllCoursesOfSemester = (
  semester: ISemester,
  segments: ISegment[]
) => {
  for (const course of semester.courses) {
    const block = findBlockInSegments(segments, course?.blockId || "");
    block && block.coursesDetails.push(course);
  }
  semester.courses = [];
};

export const moveCourseFromSemesterToSegments = (
  semester: ISemester,
  segments: ISegment[],
  courseId: string
) => {
  const course = semester.courses.find((c) => c._id === courseId);

  const block = findBlockInSegments(segments, course?.blockId || "");

  block &&
    (semester.courses = moveCourse(
      semester.courses,
      block.coursesDetails,
      courseId
    ));
};

const moveCourse = (
  sourceList: ICourse[],
  destinationList: ICourse[],
  courseId: string
) => {
  const course = sourceList.find((course) => course._id === courseId);
  const courseAlreadyInDestination = destinationList.some(
    (course) => course._id === courseId
  );

  if (course && !courseAlreadyInDestination) {
    destinationList.push(course);
    return sourceList.filter((course) => course._id !== courseId);
  }

  return sourceList;
};

export const dragCourseHandler = (
  dropResult: DropResult,
  semesters: ISemester[],
  program: IProgram | null
) => {
  if (dropResult?.destination) {
    const sourceId = dropResult.source.droppableId;
    const destinationId = dropResult.destination.droppableId;

    const isSourceSemester = sourceId.includes("Trimestre");

    let removedCourse: ICourse | undefined;

    const { courseId, blockId } = deconstructDraggableId(
      dropResult.draggableId
    );

    if (isSourceSemester) {
      removedCourse = removeCourseFromSemester(semesters, sourceId, courseId);
    } else if (program) {
      removedCourse = removeCourseFromProgramSegments(
        program.segments,
        sourceId || blockId,
        courseId
      );
    }

    removedCourse &&
      addCourseToSemester(semesters, destinationId, removedCourse);
  }
};

export const initialSemestersAndProgramsBasedonDefaultCourseLine = (
  program: IProgram,
  orientation: IOrientation | null,
  termsInUrl: string
) => {
  if (orientation && isOrientationValid(orientation)) {
    return constructSemestersBasedonOrientation(orientation, program);
  } else return initialSemestersBasedOnURL(termsInUrl, program);
};

const isOrientationValid = (orientation: IOrientation | null) => {
  if (orientation) {
    return !(
      orientation.segments.length === 0 &&
      orientation.semesters.every((semester) => semester.courses.length === 0)
    );
  }

  return false;
};

// given an array of blocks, this function return the list of segments they belong to
export const FindSegmentsIdsFromBlocks = (
  segments: ISegment[],
  blocs: string[]
) => {
  type result = string[];
  let result: result = [];

  blocs.forEach((myb) => {
    let segmentFound = segments.find((s) => {
      let blocFound = s.blocs.find((b) => {
        if (myb === b.id) return true;
      });
      if (blocFound) return true;
    });
    if (segmentFound) result.push(segmentFound.id);
  });
  return result;
};
const removeCourseFromSemester = (
  semesters: ISemester[],
  semesterId: string,
  courseId: string
) => {
  const semester = semesters.find((s) => s.id === semesterId);
  if (semester) {
    return removeFromCourses(semester.courses, courseId);
  }
};

export const removeCourseFromProgramSegments = (
  segments: ISegment[],
  blockId: string,
  courseId: string
) => {
  const block = findBlockInSegments(segments, blockId);

  if (block) {
    return removeFromCourses(block.coursesDetails, courseId);
  }
};

const findBlockInSegments = (segments: ISegment[], blockId: string) => {
  for (const segment of segments) {
    const block = segment.blocs.find((b) => b.id === blockId);
    if (block) {
      return block;
    }
  }
};

export const removeFromCourses = (courses: ICourse[], courseId: string) => {
  const courseIndex = courses.findIndex((course) => course._id === courseId);
  if (courseIndex > -1) {
    const [removed] = courses.splice(courseIndex, 1);
    return removed;
  }
};

export const addCourseToSemester = (
  semesters: ISemester[],
  semesterId: string,
  course: ICourse
) => {
  const semester = semesters.find((s) => s.id === semesterId);
  if (semester) {
    semester.courses.push(course);
  }
};

export const findBlockCourses = (
  courseIds: string[],
  allCourses: ICourse[]
): ICourse[] => {
  return allCourses.filter((course) => courseIds.includes(course._id));
};

export const constructDraggableId = (blockId: string, courseId: string) => {
  return `${courseId};${blockId}`;
};

export const deconstructDraggableId = (draggableId: string) => {
  const [courseId, blockId] = draggableId.split(";");

  return { courseId, blockId };
};

export const getAllCourses = (
  programSegments: IProgram,
  includedSegments: string[] = []
) => {
  const courses: ICourse[] = [];

  if (programSegments) {
    programSegments.segments
      .filter(
        (segment) =>
          includedSegments.length === 0 || includedSegments.includes(segment.id)
      )
      .forEach((segment) => {
        segment.blocs.forEach((block) => {
          courses.push(...block.coursesDetails);
        });
      });
  }
  return courses;
};

//Functions for the construction of semesters based on orientaion/url:

export const constructSemestersBasedonOrientation = (
  orientation: IOrientation,
  program: IProgram
): ISemester[] => {
  // Initialize semesters based on the seasons from orientation
  const semesters = initializeSemestersFromSeasons(
    orientation.semesters.map((s) => s.season)
  );

  // Process and add courses to each semester
  orientation.semesters.forEach((orientationSemester, index) => {
    moveCoursesFromProgramToSemester(
      semesters,
      semesters[index].id,
      program,
      orientationSemester.courses
    );
  });

  return semesters;
};

const initialSemestersBasedOnURL = (
  urlTerms: string,
  program: IProgram
): ISemester[] => {
  // Construct initial semesters based on the URL
  const semesters = constructSemestersBasedonURL(urlTerms);
  const parsedTerms = parseTermsInUrl(urlTerms);

  if (semesters.length === parsedTerms.length) {
    parsedTerms.forEach((term, index) => {
      if (term && term.courses.length) {
        moveCoursesFromProgramToSemester(
          semesters,
          semesters[index].id,
          program,
          term.courses
        );
      }
    });
  }

  return semesters;
};

const initializeSemestersFromSeasons = (
  seasons: AvailableTermsKeys[]
): ISemester[] => {
  return seasons.map((season, index) =>
    getDefaultInitialSemester(index, season)
  );
};

const moveCoursesFromProgramToSemester = (
  semesters: ISemester[],
  semesterId: string,
  program: IProgram,
  courses: { blockId: string; courseId: string }[]
) => {
  courses.forEach(({ blockId, courseId }) => {
    const removedCourse = removeCourseFromProgramSegments(
      program.segments,
      blockId,
      courseId
    );
    if (removedCourse) {
      addCourseToSemester(semesters, semesterId, removedCourse);
    }
  });
};

// some functions to produce init data:
export const getInitialSemesters = (): ISemester[] => {
  return Array.from({ length: 12 }, (_, index) =>
    getDefaultInitialSemester(index, getSemesterSeasonBasedonIndex(index))
  );
};

export const getDefaultInitialSemester = (
  index: number,
  season: AvailableTermsKeys
) => ({
  id: `Trimestre${index + 1}`,
  title: `Trimestre ${index + 1}`,
  season: season,
  credits: 0,
  maxCredits: 18,
  courses: [],
  messages: [],
});
export const findBlockIndex = (segments: ISegment[], blocId: string) => {
  let index = 0;
  for (let segment of segments) {
    index = 0;
    for (let bloc of segment.blocs) {
      if (bloc.id === blocId) {
        return index;
      }
      index++;
    }
  }
  return -1;
};

export const isValidSeason = (season: string): season is AvailableTermsKeys => {
  return Object.values(AvailableTermsKeys).includes(
    season as AvailableTermsKeys
  );
};

export const getSemesterSeasonBasedonIndex = (index: number) => {
  return index % 3 === 0
    ? AvailableTermsKeys.Autumn
    : index % 3 === 1
    ? AvailableTermsKeys.Winter
    : AvailableTermsKeys.Summer;
};

export const fakeCourse = (index: number): ICourse => {
  return {
    _id: `BIO1953${index}`,
    code: "BIO",
    number: "1953",
    name: "Origine et diversité du vivant",
    description: "Hiérarchie des niveaux structuraux.",
    credits: 3,
    available_terms: {
      autumn: true,
      winter: true,
      summer: true,
    },
    available_periods: {
      daytime: true,
      evening: true,
    },
    requirement_text: "",
    prerequisite_courses: [],
    concomitant_courses: [],
    equivalent_courses: [],
    schedules: [],
  };
};

export const fakeBlock = (index: number): IBlock => {
  return {
    id: `Bloc 70A${index}`,
    type: "Options",
    name: `block name ${index}`,
    description: "Obligatoire - 21 crédits.",
    min: "3",
    max: "6",
    coursesDetails: Array.from({ length: 10 }, (_, index) =>
      fakeCourse(index + 1)
    ),
  };
};
