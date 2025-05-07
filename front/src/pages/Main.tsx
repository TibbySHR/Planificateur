import React from "react";
import FilterProgramSpecificsBox from "../components/FilterProgramSpecificsBox/FilterProgramSpecificsBox";
import CourseSelection from "../components/CourseSelection/CourseSelection";
import CourseSelectionProvider from "../store/providers/CourseSelectionProvider";

const Main = () => {
  return (
    <CourseSelectionProvider>
      <FilterProgramSpecificsBox />
      <CourseSelection />
    </CourseSelectionProvider>
  );
};

export default Main;
