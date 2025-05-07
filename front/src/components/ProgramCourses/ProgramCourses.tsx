import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import CollapsibleList from "../CollapsibleList/CollapsibleList";
import FuzzySearchInput from "../FuzzySearchInput/FuzzySearchInput";
import { ICourse } from "../../models/course";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import ProgramCourseList from "../ProgramCourseList/ProgramCourseList";
import { getAllCourses } from "../../store/helpers/courseSelectionHelpers";
import SVGIcon from "../SVGIcon/SVGIcon";
import { SchoolContext } from "../../store/contexts/schoolContext";
import { useTranslation } from "react-i18next";

const ProgramCourses = () => {
  const schoolContext = useContext(SchoolContext);
  const CSContext = useContext(CourseSelectionContext);
  const { t } = useTranslation();

  const [filteredCourses, setFilteredCourses] = useState([]);

  const [allCourses, setAllCourses] = useState<ICourse[]>([]);

  const [isProgramColumnShow, setIsProgramColumnShow] = useState(true);

  useEffect(() => {
    CSContext.programSegments &&
      setAllCourses(
        getAllCourses(
          CSContext.programSegments,
          schoolContext.selectedOrientation?.segments
        )
      );
  }, [JSON.stringify(CSContext.programSegments)]);

  const onSearchInputBlur = () => {
    CSContext.setIsSearchMode(false);
    setFilteredCourses([]);
  };

  const onToggleProgramDrawer = () => {
    setIsProgramColumnShow((show) => !show);
  };

  return (
    <div className={`program_courses`}>
      <div
        className={`program_courses__column ${
          !isProgramColumnShow && "program_courses__column--hide"
        }`}
      >
        <FuzzySearchInput<ICourse>
          list={allCourses}
          setFilteredList={setFilteredCourses}
          onFocus={() => CSContext.setIsSearchMode(true)}
          onBlur={onSearchInputBlur}
          placeholder={t("seachbar.program.courses.placeholder")}
        />
        {CSContext.isSearchMode ? (
          <ProgramCourseList courses={filteredCourses} droppableId="" />
        ) : (
          <div>
            <CollapsibleList />
          </div>
        )}
      </div>
      <div className="program_courses__drawer" onClick={onToggleProgramDrawer}>
        <div
          className={`program_courses__drawer__arrow ${
            isProgramColumnShow && "program_courses__drawer__arrow--open"
          }`}
        >
          <SVGIcon name="arrowRight" viewBox="-4.5 0 20 20" fill="#ebebeb" />
        </div>
      </div>
    </div>
  );
};

export default ProgramCourses;
