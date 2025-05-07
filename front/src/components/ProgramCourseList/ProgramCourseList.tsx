import React, { useContext } from "react";
import "./styles.scss";
import { ICourse } from "../../models/course";
import DraggableCourse from "../DraggableCourse/DraggableCourse";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import { StrictModeDroppable } from "../StrictModeDroppable/StrictModeDroppable";

const ProgramCourseList = (props: {
  courses: ICourse[];
  droppableId: string;
  blockExpandedStates?: {
    [key: string]: boolean;
  };
}) => {
  const CScontext = useContext(CourseSelectionContext);

  const { courses, droppableId, blockExpandedStates = {} } = props;

  return (
    <StrictModeDroppable
      droppableId={droppableId}
      key={droppableId}
      isDropDisabled={true}
    >
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className="program_course_list">
            {courses.map((course, k) => {
              return (
                <DraggableCourse
                  key={k}
                  course={course}
                  index={k}
                  size={CScontext.draggingCourseId === course._id ? "sm" : "md"}
                  isOuterBlockExpanded={
                    blockExpandedStates[course.blockId || ""]
                  }
          />
              );
            })}
          </div>
          {provided.placeholder}
        </div>
      )}
    </StrictModeDroppable>
  );
};

export default ProgramCourseList;
