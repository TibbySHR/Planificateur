import { DropResult } from "react-beautiful-dnd";
import { createContext } from "react";
import { IProgram } from "../../models/program";
import { ISemester } from "../../models/semester";
import { IAlertMessage } from "../../models/alertMessage";
import { ICourse } from "../../models/course";
import { IOrientation } from "../../models/orientation";
import { AvailableTermsKeys } from "../../models/availableTerms";

export interface ICourseSelection {
  maxCredits: number;
  programSegments: IProgram | null;
  semesters: ISemester[];
  isLoading: boolean;
  isSearchMode: boolean;
  draggingCourseId: string;

  // other things not related to course selection:
  program: IProgram | null;
}

export interface ICourseSelectionContext extends ICourseSelection {
  getTotalCredits: () => number;
  getSemesterCredits: (semesterId: string) => number;
  getSemesterMessages: (semesterId: string) => IAlertMessage[];
  dragCourse: (result: DropResult) => void;
  deleteCourseFromSemester: (semesterId: string, courseId: string) => void;
  deleteAllSemesterCourses: (semesterId: string) => void;
  fetchProgramData: (programId: string) => void;
  setDraggingCourseId: (value: string) => void;
  setIsSearchMode: (value: boolean) => void;
  addCourse: (semesterId: string, course: ICourse) => void;
  emptyAllSemesters: () => void;
  updateCourseLineupBasedonOrientation: (orientation: IOrientation) => void;
  setSemesterSeason: (semesterId: string, season: AvailableTermsKeys) => void;
}

export const initialCourseSelection: ICourseSelection = {
  maxCredits: 90,
  programSegments: null,
  semesters: [],
  isLoading: false,
  isSearchMode: false,
  draggingCourseId: "",
  program: null,
};

export const CourseSelectionContext = createContext<ICourseSelectionContext>({
  ...initialCourseSelection,
  getTotalCredits: () => 0,
  getSemesterCredits: () => 0,
  getSemesterMessages: () => [],
  dragCourse: () => void true,
  deleteCourseFromSemester: () => void true,
  deleteAllSemesterCourses: () => void true,
  fetchProgramData: () => void true,
  setDraggingCourseId: () => void true,
  setIsSearchMode: () => void true,
  addCourse: () => void true,
  emptyAllSemesters: () => void true,
  updateCourseLineupBasedonOrientation: () => void true,
  setSemesterSeason: () => void true,
});
