import React, { MouseEvent, useContext, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import Course from "../Course/Course";
import { ICourse } from "../../models/course";
import { constructDraggableId } from "../../store/helpers/courseSelectionHelpers";
import { SchoolContext } from "../../store/contexts/schoolContext";

interface DraggableCourseProps {
  course: ICourse;
  index: number;
  size?: string;
  isDragDisabled?: boolean;
  onRemoveClick?: (e: MouseEvent) => void;
  isOuterBlockExpanded?: boolean;
  isExpanded? : boolean;
  season?:string;
  selectedSections? : string[];
  setSelectedSections? : React.Dispatch<React.SetStateAction<string[]>>
}

const DraggableCourse: React.FC<DraggableCourseProps> = (props) => {
  const {
    course,
    index,
    size,
    onRemoveClick,
    isDragDisabled = false,
    isOuterBlockExpanded,
    isExpanded, 
    season,
    selectedSections,
    setSelectedSections,
  } = props;

  const schoolContext = useContext(SchoolContext);

  const draggableId = constructDraggableId(course.blockId || "", course._id);

  const courseGridElementRef = useRef<HTMLDivElement>(null);

  const setGridContainerRowSpan = (rowSpan: number) => {
    if (courseGridElementRef.current) {
      courseGridElementRef.current.style.gridRowEnd = "span " + rowSpan;
    }
  };

  const openPopup = (e: MouseEvent, message: JSX.Element) => {
    e.stopPropagation();
    schoolContext.togglePopUp(true, message);
  };

  const courseMsg = (
    <>
      <div>
        <h3 style={{ display: "inline" }}>{course.name}</h3>
        <h5>{course._id}</h5>
      </div>
      <div>{course.description}</div>
      <br />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "16px",
        }}
      >
        <div>Crédits:</div>
        <div>{course.credits}</div>
        {course.requirement_text && (
          <>
            <div>Exigence:</div>
            <div>{course.requirement_text}</div>
          </>
        )}
      </div>
    </>
  );

  return (
    <div
      ref={courseGridElementRef}
      onClick={(e) => openPopup(e, <>{courseMsg}</>)}
    >
      <Draggable
        draggableId={draggableId}
        index={index}
        key={draggableId}
        isDragDisabled={isDragDisabled}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Course
              course={course}
              size={size}
              onRemoveClick={onRemoveClick}
              isOuterBlockExpanded={isOuterBlockExpanded}
              setGridContainerRowSpan={setGridContainerRowSpan}
              isExpanded={isExpanded}
              season={season}
              setSelectedSections={setSelectedSections}
              selectedSections={selectedSections}
            />
          </div>
        )}
      </Draggable>
    </div>
  );
};

export default DraggableCourse;
