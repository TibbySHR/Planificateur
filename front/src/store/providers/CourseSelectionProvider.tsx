import { ReactNode, useContext, useEffect, useReducer } from "react";
import { CourseSelectionReducer } from "../reducers/courseSelectionReducer";
import { DropResult } from "react-beautiful-dnd";
import { CourseSelectionActions } from "../actions/courseSelectionActions";
import { getPrograms } from "../../utils/APIs";
import {
  CourseSelectionContext,
  initialCourseSelection,
} from "../contexts/courseSelectionContext";
import useSemesterInfo from "../../hooks/useSemesterInfo";
import { ICourse } from "../../models/course";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchTermsFromURL } from "../../utils/helpers/url";
import { ISemester } from "../../models/semester";
import { getDefaultSelectedOrientation } from "../helpers/schoolHelpers";
import { SchoolContext } from "../contexts/schoolContext";
import { IOrientation } from "../../models/orientation";
import useUpdateURL from "../../hooks/useUpdateURL";
import { AvailableTermsKeys } from "../../models/availableTerms";

function CourseSelectionProvider(props: { children: ReactNode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const schoolContext = useContext(SchoolContext);

  const [state, dispatch] = useReducer(
    CourseSelectionReducer,
    initialCourseSelection
  );

  const { getTotalCredits, getSemesterCredits, getSemesterMessages } =
    useSemesterInfo(state.semesters);

  useUpdateURL(
    state.semesters,
    schoolContext.selectedOrientation,
    state.program?._id || ""
  );

  const dragCourse = (dropResult: DropResult) => {
    dispatch({
      type: CourseSelectionActions.DRAG_COURSE,
      payload: { dropResult },
    });
  };
  const addCourse = (semesterId: string, course: ICourse) => {
    dispatch({
      type: CourseSelectionActions.ADD_COURSE,
      payload: { semesterId, course },
    });
  };

  const fetchProgramData = async (programId: string) => {
    try {
      dispatch({
        type: CourseSelectionActions.SET_PROGRAM,
        payload: { program: null, courses: [] },
      });

      let data = await getPrograms([programId]);

      dispatch({
        type: CourseSelectionActions.SET_PROGRAM,
        payload: {
          program: data.programs[0],
          courses: data.courses,
          orientation: getDefaultSelectedOrientation(
            programId,
            schoolContext.selectedOrientation?._id || "",
            schoolContext.faculties
          ),
          urlTerms: fetchTermsFromURL(searchParams),
          navigate,
          searchParams,
        },
      });
    } catch (error) {
      console.log(" FETCH PROGRAM API error: ", error);
    }
  };

  const deleteCourseFromSemester = (semesterId: string, courseId: string) => {
    dispatch({
      type: CourseSelectionActions.DELETE_COURSE,
      payload: { semesterId, courseId },
    });
  };

  const deleteAllSemesterCourses = (semesterId: string) => {
    dispatch({
      type: CourseSelectionActions.DELETE_ALL_COURSES,
      payload: { semesterId },
    });
  };

  const setDraggingCourseId = (value: string) => {
    dispatch({
      type: CourseSelectionActions.SET_DRAGGING_COURSE_ID,
      payload: { id: value },
    });
  };

  const setIsSearchMode = (value: boolean) => {
    dispatch({
      type: CourseSelectionActions.SET_SEARCH_MODE,
      payload: { value },
    });
  };

  const emptyAllSemesters = () => {
    dispatch({
      type: CourseSelectionActions.EMPTY_ALL_SEMESTERS,
      payload: {},
    });
  };

  const updateCourseLineupBasedonOrientation = (orientation: IOrientation) => {
    dispatch({
      type: CourseSelectionActions.UPDATE_COURSE_LINEUP_FOR_ORIENTATION,
      payload: { orientation, navigate, searchParams },
    });
  };

  const setSemesterSeason = (
    semesterId: string,
    season: AvailableTermsKeys
  ) => {
    dispatch({
      type: CourseSelectionActions.SET_SEMESTER_SEASON,
      payload: { semesterId, season },
    });
  };

  const initialSemesters = () => {
    const semesters: ISemester[] = []; // for now, then set it according to url

    dispatch({
      type: CourseSelectionActions.SET_SEMESTERS,
      payload: { semesters },
    });
  };

  useEffect(() => {
    initialSemesters();
  }, []);

  const providerValue = {
    ...state,
    getTotalCredits,
    getSemesterCredits,
    getSemesterMessages,
    dragCourse,
    fetchProgramData,
    deleteCourseFromSemester,
    deleteAllSemesterCourses,
    setDraggingCourseId,
    setIsSearchMode,
    addCourse,
    emptyAllSemesters,
    updateCourseLineupBasedonOrientation,
    setSemesterSeason,
  };

  return (
    <CourseSelectionContext.Provider value={providerValue}>
      {props.children}
    </CourseSelectionContext.Provider>
  );
}

export default CourseSelectionProvider;
