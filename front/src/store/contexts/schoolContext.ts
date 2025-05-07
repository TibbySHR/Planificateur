import React from "react";
import { createContext, ReactNode } from "react";
import { IFaculty } from "../../models/faculty";
import { IOrientation } from "../../models/orientation";

export interface ISchool {
  faculties: IFaculty[];
  selectedFacultyId: string;
  selectedDepartmentId: string;
  selectedProgramId: string;
  selectedOrientation: IOrientation | null;
  isPopupOpen: boolean;
  popupContent: ReactNode;
}

export interface ISchoolContext extends ISchool {
  selectFaculty: (facultyId: string) => void;
  selectDepartment: (departmentId: string) => void;
  selectProgram: (programId: string) => void;
  showToast: (text: string) => void;
  selectOrientation: (orientation: IOrientation) => void;
  togglePopUp: (isOpen: boolean, content?: ReactNode) => void;
}

export const initialSchool: ISchool = {
  faculties: [],
  selectedFacultyId: "",
  selectedDepartmentId: "",
  selectedProgramId: "",
  selectedOrientation: null,
  isPopupOpen: false,
  popupContent: null,
};

export const SchoolContext = createContext<ISchoolContext>({
  ...initialSchool,
  selectFaculty: () => void true,
  selectDepartment: () => void true,
  selectProgram: () => void true,
  selectOrientation: () => void true,
  showToast: () => void true,
  togglePopUp: () => void true,
});
