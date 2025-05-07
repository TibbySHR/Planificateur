import { ReactNode, useEffect, useReducer } from "react";
import { initialSchool, SchoolContext } from "../contexts/schoolContext";
import { SchoolReducer } from "../reducers/schoolReducer";
import { getSchoolStructure } from "../../utils/APIs";
import { SchoolActions } from "../actions/schoolActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IOrientation } from "../../models/orientation";
import PopupWindow from "../../components/PopupWindow/PopupWindow";

function SchoolProvider(props: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(SchoolReducer, initialSchool);

  useEffect(() => {
    fetchSchoolStructureData();
  }, []);

  const fetchSchoolStructureData = async () => {
    try {
      let data = await getSchoolStructure();
      dispatch({
        type: SchoolActions.SET_SCHOOL,
        payload: { faculties: data, searchParams },
      });
    } catch (error) {
      console.log("Filter API error: ", error);
    }
  };

  const selectOrientation = (orientation: IOrientation) => {
    dispatch({
      type: SchoolActions.SELECT_ORIENTATION,
      payload: { orientation },
    });
  };
  const selectFaculty = (facultyId: string) => {
    dispatch({
      type: SchoolActions.SELECT_FACULTY,
      payload: { facultyId },
    });
  };

  const selectDepartment = (departmentId: string) => {
    dispatch({
      type: SchoolActions.SELECT_DEPARTMENT,
      payload: { departmentId },
    });
  };

  const selectProgram = (programId: string) => {
    dispatch({
      type: SchoolActions.SELECT_PROGRAM,
      payload: { programId },
    });
  };

  const showToast = (text: string) => toast(text);

  const togglePopUp = (isOpen: boolean, content?: ReactNode) => {
    dispatch({
      type: SchoolActions.TOGGLE_POPUP,
      payload: { isOpen, content: content || <></> },
    });
  };

  const providerValue = {
    ...state,
    selectFaculty,
    selectDepartment,
    selectProgram,
    selectOrientation,
    showToast,
    togglePopUp,
  };

  return (
    <SchoolContext.Provider value={providerValue}>
      {props.children}
      <ToastContainer />
      <PopupWindow
        isOpen={state.isPopupOpen}
        onClose={() => togglePopUp(false)}
      >
        {state.popupContent}
      </PopupWindow>
    </SchoolContext.Provider>
  );
}

export default SchoolProvider;
