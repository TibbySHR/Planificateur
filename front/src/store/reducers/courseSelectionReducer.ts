import { DropResult } from "react-beautiful-dnd";
import {
  constructSemestersBasedonOrientation,
  deleteAllCoursesOfSemester,
  dragCourseHandler,
  findBlockCourses,
  initialSemestersAndProgramsBasedonDefaultCourseLine,
  isValidSeason,
  moveCourseFromSemesterToSegments,
} from "../helpers/courseSelectionHelpers";
import { CourseSelectionActions } from "../actions/courseSelectionActions";
import {
  ICourseSelection,
  initialCourseSelection,
} from "../contexts/courseSelectionContext";
import { cloneDeep } from "lodash";
import { ICourse } from "../../models/course";
import { IProgram } from "../../models/program";
import { ISemester } from "../../models/semester";
import { IOrientation } from "../../models/orientation";
import { NavigateFunction } from "react-router-dom";
import { AvailableTermsKeys } from "../../models/availableTerms";

export const CourseSelectionReducer = (
  state: ICourseSelection = initialCourseSelection,
  action: { type: CourseSelectionActions; payload: any }
) => {
  const newState = { ...state };
  // console.log("Payload of", action.type, ":", action.payload);
  switch (action.type) {
    case CourseSelectionActions.ADD_COURSE: {
      const { semesterId, course } = action.payload as {
        semesterId: string;
        course: ICourse;
      };
      let newSemester = newState.semesters.find((s) => {
        if (s.id === semesterId) {
          return true;
        } else {
          return false;
        }
      });
      if (newSemester) {
        newSemester.courses.push(course);
      }
      break;
    }
    case CourseSelectionActions.DRAG_COURSE: {
      const { dropResult } = action.payload as { dropResult: DropResult };
      dragCourseHandler(
        dropResult,
        newState.semesters,
        newState.programSegments
      );
      break;
    }

    case CourseSelectionActions.SET_DRAGGING_COURSE_ID: {
      const { id } = action.payload as { id: string };
      newState.draggingCourseId = id;
      break;
    }

    case CourseSelectionActions.DELETE_COURSE:
      const { semesterId, courseId } = action.payload as {
        semesterId: string;
        courseId: string;
      };
      const { program, programSegments } = newState;

      const semester = newState.semesters.find((s) => s.id === semesterId);

      if (program && programSegments && semester) {
        moveCourseFromSemesterToSegments(
          semester,
          programSegments.segments,
          courseId
        );
      }
      break;

    case CourseSelectionActions.DELETE_ALL_COURSES: {
      const { semesterId } = action.payload as {
        semesterId: string;
      };
      const { program, programSegments } = newState;
      const semester = newState.semesters.find((s) => s.id === semesterId);

      if (program && programSegments && semester) {
        deleteAllCoursesOfSemester(semester, programSegments.segments);
      }

      break;
    }
    case CourseSelectionActions.EMPTY_ALL_SEMESTERS: {
      const { semesters, program, programSegments } = newState;
      if (program && programSegments) {
        semesters.forEach((semester) =>
          deleteAllCoursesOfSemester(semester, programSegments.segments)
        );
      }
      break;
    }
    case CourseSelectionActions.SET_PROGRAM: {
      const {
        program,
        courses,
        orientation,
        urlTerms,
        navigate,
        searchParams,
      } = action.payload as {
        program: IProgram;
        courses: ICourse[];
        orientation: IOrientation | null;
        urlTerms: string;
        navigate: NavigateFunction;
        searchParams: URLSearchParams;
      };

      if (program) {
        const programData = {
          _id: program._id,
          name: program.name,
          structure: program.structure,
          orientation: program.orientation,
          segments: program.segments.map((segment) => ({
            ...segment,
            blocs: segment.blocs.map((block) => {
              return {
                ...block,
                coursesDetails: findBlockCourses(
                  block.courses || [],
                  courses
                ).map((course) => ({
                  ...course,
                  blockId: block.id,
                })),
              };
            }),
          })),
        };
        newState.program = cloneDeep(programData);

        newState.programSegments = cloneDeep(programData);
        newState.semesters =
          initialSemestersAndProgramsBasedonDefaultCourseLine(
            newState.programSegments,
            orientation,
            urlTerms
          );
        newState.isLoading = false;
      } else {
        newState.program = program;
        newState.programSegments = program;
      }

      break;
    }

    case CourseSelectionActions.SET_ISLOADING:
      {
        const { value } = action.payload as {
          value: boolean;
        };
        newState.isLoading = value;
      }
      break;

    case CourseSelectionActions.SET_SEARCH_MODE: {
      const { value } = action.payload as {
        value: boolean;
      };
      newState.isSearchMode = value;
      break;
    }

    case CourseSelectionActions.SET_SEMESTERS: {
      const { semesters } = action.payload as {
        semesters: ISemester[];
      };

      newState.semesters = semesters;
      break;
    }

    case CourseSelectionActions.UPDATE_COURSE_LINEUP_FOR_ORIENTATION: {
      const { orientation, navigate, searchParams } = action.payload as {
        orientation: IOrientation;
        navigate: NavigateFunction;
        searchParams: URLSearchParams;
      };
      const resetProgram = cloneDeep(newState.program);
      if (resetProgram) {
        newState.semesters = constructSemestersBasedonOrientation(
          orientation,
          resetProgram
        );
        newState.programSegments = resetProgram;
      }

      break;
    }

    case CourseSelectionActions.SET_SEMESTER_SEASON: {
      const { semesterId, season } = action.payload as {
        semesterId: string;
        season: AvailableTermsKeys;
      };

      const semester = newState.semesters.find(
        (semester) => semester.id === semesterId
      );
      if (semester && isValidSeason(season)) semester.season = season;
      break;
    }
    default:
      break;
  }

  // console.log("New state to be returned:", newState);
  return newState;
};
