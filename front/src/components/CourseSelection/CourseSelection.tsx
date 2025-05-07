import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import SemestersGrid from "../SemestersGrid/SemestersGrid";
import { DragDropContext, DragUpdate, DropResult } from "react-beautiful-dnd";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import { deconstructDraggableId } from "../../store/helpers/courseSelectionHelpers";
import { ICourse } from "../../models/course";
import { HighlightRanges } from "@nozbe/microfuzz";
import ProgramCourses from "../ProgramCourses/ProgramCourses";

const CourseSelection = () => {
  const CSContext = useContext(CourseSelectionContext);

  const onDragEnd = (result: DropResult) => {
    CSContext.dragCourse(result);
    CSContext.setDraggingCourseId("");
  };

  const onDragUpdate = (update: DragUpdate) => {
    if (update.destination) {
      const { courseId } = deconstructDraggableId(update.draggableId);
      CSContext.setDraggingCourseId(courseId);
    } else {
      CSContext.setDraggingCourseId("");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="course-selection-container">
        <ProgramCourses />
        <SemestersGrid />
      </div>
    </DragDropContext>
  );
};

export default CourseSelection;
