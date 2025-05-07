import React, { useContext, useEffect } from "react";
import "./styles.scss";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import { SchoolContext } from "../../store/contexts/schoolContext";
import {
  getDepartmentsOfFaculty,
  getProgramsByDepartment,
  getOrientationsByProgram,
} from "../../store/helpers/schoolHelpers";
import { t } from "i18next";
import { FormFieldType } from "../../models/FormField";
import Form from "../Form/Form";
import Collapsible from "../Collapsible/Collapsible";
import SVGIcon from "../SVGIcon/SVGIcon";

const FilterProgramSpecificsBox = () => {
  const schoolContext = useContext(SchoolContext);
  const CSContext = useContext(CourseSelectionContext);

  const onSelectOrientation = (orientationId: string) => {
    const orientaion = getOrientationsByProgram(
      schoolContext.selectedProgramId,
      schoolContext.faculties
    ).find((o) => o._id === orientationId);

    if (orientaion) {
      schoolContext.selectOrientation(orientaion);
      CSContext.updateCourseLineupBasedonOrientation(orientaion);
    }
  };

  const filters = [
    {
      title: t("filter.dropdowns.title"),
      fields: [
        {
          id: "FacultySelectorId",
          label: t("faculty"),
          value: schoolContext.selectedFacultyId,
          onChange: (value: string) => schoolContext.selectFaculty(value),
          options: schoolContext.faculties,
          type: FormFieldType.Select,
        },
        {
          id: "DepartmentSelectorId",
          label: t("department"),
          value: schoolContext.selectedDepartmentId,
          onChange: (value: string) => schoolContext.selectDepartment(value),
          options: getDepartmentsOfFaculty(
            schoolContext.selectedFacultyId,
            schoolContext.faculties
          ),
          type: FormFieldType.Select,
        },
        {
          id: "ProgramSelectorId",
          label: t("program"),
          value: schoolContext.selectedProgramId,
          onChange: (value: string) => schoolContext.selectProgram(value),
          options: getProgramsByDepartment(
            schoolContext.selectedDepartmentId,
            schoolContext.faculties
          ),
          type: FormFieldType.Select,
        },
        {
          id: "OrientationSelectorId",
          label: t("orientation"),
          value: schoolContext.selectedOrientation?._id || "",
          onChange: (id: string) => onSelectOrientation(id),
          options: getOrientationsByProgram(
            schoolContext.selectedProgramId,
            schoolContext.faculties
          ),
          type: FormFieldType.Select,
        },
      ],
    },
    {
      title: t("Trouvez votre programme par nom"),
      fields: [
        {
          id: "CourseSelectorId",
          label: t("programresearch"),
          value: "",
          onChange: (value: string) => console.log("Course selected:", value),
          options: [],
          type: FormFieldType.Search,
        },
      ],
    },
  ];

  useEffect(() => {
    schoolContext.selectedProgramId &&
      CSContext.fetchProgramData(schoolContext.selectedProgramId);
  }, [schoolContext.selectedProgramId]);

  const collapsibleIcon = {
    name: "arrowDown",
    width: "25",
    height: "25",
    class: "filter-form__collapsible__header_icon",
    expandedClass: "filter-form__collapsible__header_icon--expanded",
  };

  const getFilterCollapsibleTitle = (name: string) => {
    return (
      <div className="filter-form__collapsible__title">
        <SVGIcon name="filter" viewBox="0 0 24 24" width="20" height="20" />
        <span>{name}</span>
      </div>
    );
  };
  return (
    <div className="filter-form">
      <div className="filter-form__header">
        <b>{t("filter.header")}</b>
      </div>
      <div>
        {filters.map((filter, i) => {
          return (
            <Collapsible
              key={i}
              id={`filter${i}`}
              collapse_config={{ duration: 300, defaultExpanded: true }}
              headerTitle={getFilterCollapsibleTitle(filter.title)}
              headerClass="filter-form__collapsible__outer_header"
              headerIcon={collapsibleIcon}
            >
              <Form
                fields={filter.fields}
                isLoading={schoolContext.faculties.length === 0}
                className="filter-form__item"
              />
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default FilterProgramSpecificsBox;
