import { IFaculty } from "../../models/faculty";
import { SchoolActions } from "../actions/schoolActions";
import { initialSchool, ISchool } from "../contexts/schoolContext";
import {
  getDefaultSelectedDepartment,
  getDefaultSelectedProgram,
  getDefaultSelectedOrientation,
  getDefaultSchoolFilters,
} from "../helpers/schoolHelpers";
import {
  fetchOrientationFromUrl,
  fetchProgramFromUrl,
} from "../../utils/helpers/url";
import { IOrientation } from "../../models/orientation";
import { ReactNode } from "react";

export const SchoolReducer = (
  state: ISchool = initialSchool,
  action: { type: SchoolActions; payload: any }
) => {
  const newState = { ...state };
  console.log("Payload of", action.type, ":", action.payload);
  switch (action.type) {
    case SchoolActions.SET_SCHOOL:
      {
        const { faculties, searchParams } = action.payload as {
          faculties: IFaculty[];
          searchParams: URLSearchParams;
        };
        const programInUrl = fetchProgramFromUrl(searchParams);
        const orientationInUrl = fetchOrientationFromUrl(searchParams);

        const { facultyId, departmentId, programId, orientation } =
          getDefaultSchoolFilters(faculties, programInUrl, orientationInUrl);

        newState.faculties = faculties;
        newState.selectedFacultyId = facultyId;
        newState.selectedDepartmentId = departmentId;
        newState.selectedProgramId = programId;
        newState.selectedOrientation = orientation;
      }
      break;

    case SchoolActions.SELECT_FACULTY:
      {
        const { facultyId } = action.payload as {
          facultyId: string;
        };

        const departmentId = getDefaultSelectedDepartment(
          facultyId,
          newState.faculties
        );

        const programId = getDefaultSelectedProgram(
          departmentId,
          newState.faculties
        );
        const orientation = getDefaultSelectedOrientation(
          programId,
          "",
          newState.faculties
        );

        newState.selectedFacultyId = facultyId;
        newState.selectedDepartmentId = departmentId;
        newState.selectedProgramId = programId;
        newState.selectedOrientation = orientation;
      }
      break;

    case SchoolActions.SELECT_DEPARTMENT:
      {
        const { departmentId } = action.payload as {
          departmentId: string;
        };

        const programId = getDefaultSelectedProgram(
          departmentId,
          newState.faculties
        );
        const orientation = getDefaultSelectedOrientation(
          programId,
          "",
          newState.faculties
        );
        newState.selectedDepartmentId = departmentId;
        newState.selectedProgramId = programId;
        newState.selectedOrientation = orientation;
      }
      break;

    case SchoolActions.SELECT_PROGRAM:
      {
        const { programId } = action.payload as {
          programId: string;
        };
        const orientation = getDefaultSelectedOrientation(
          programId,
          "",
          newState.faculties
        );

        newState.selectedProgramId = programId;
        newState.selectedOrientation = orientation;
      }
      break;
    case SchoolActions.SELECT_ORIENTATION:
      {
        const { orientation } = action.payload as {
          orientation: IOrientation;
        };

        newState.selectedOrientation = orientation;
      }
      break;

    case SchoolActions.TOGGLE_POPUP: {
      const { isOpen, content } = action.payload as {
        isOpen: boolean;
        content: ReactNode;
      };

      newState.isPopupOpen = isOpen;
      newState.popupContent = content;
      break;
    }
    default:
      break;
  }

  return newState;
};
