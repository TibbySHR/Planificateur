import React, { useContext, useEffect, useRef, useState } from "react";
import "./styles.scss";
import SemesterIcon from "../SemesterIcon/SemesterIcon";
import SVGIcon from "../SVGIcon/SVGIcon";
import { ICourse } from "../../models/course";
import { AvailableTerms } from "../../models/availableTerms";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import SectionSelector from '../SectionSelector/SectionSelector'


const Course = (props: {
  course: ICourse;
  showBlock?: boolean;
  size?: string;
  onRemoveClick?: (e: any) => void;
  isOuterBlockExpanded?: boolean;
  setGridContainerRowSpan?: (value: number) => void;
  isExpanded?:boolean;
  season?:string;
  selectedSections? : string[];
  setSelectedSections? : React.Dispatch<React.SetStateAction<string[]>>
}) => {
  const {
    course,
    size = "sm",
    onRemoveClick,
    isOuterBlockExpanded,
    setGridContainerRowSpan,
    isExpanded,
    season,
    selectedSections,
    setSelectedSections,
  } = props;

  const CSContext = useContext(CourseSelectionContext);

  const courseRef = useRef<HTMLDivElement>(null);

  const showBlockEnabled = CSContext.isSearchMode && size === "md";

  // Codes related to Choix courses in future versions:

  // const [isChoixSearchInputActive, setIsChoixSearchInputActive] =
  //   useState(false);

  // const onChoixSearchIconClick = () => {
  //   console.log("onChoixSearchIconClick !!!");

  //   setIsChoixSearchInputActive(true);
  // };

  // const isCourseChoix = course.isChoix && size === "md";

  // const choixClasses = `course_choix ${
  //   isChoixSearchInputActive && "course_choix--searching"
  // }`;

  useEffect(() => {
    setGridRowSpan();
  }, [isOuterBlockExpanded]);

  const setGridRowSpan = () => {
    if (courseRef.current && isOuterBlockExpanded && setGridContainerRowSpan) {
      const courseHeight = courseRef.current.getBoundingClientRect().height;
      const gap = 10;
      const rowSpan = Math.round((courseHeight + gap) / gap);
      setGridContainerRowSpan(rowSpan);
    }
  };


  return (
    <div className={`course course--${size}`} ref={courseRef}>
      <div className={`course__header course__header--${size}`}>
        <p className={`course__code course__code--${size}`}>{course._id}</p>
        <div className={`course__credit course__credit--${size}`}>
          {course.credits}
        </div>

        {/* <p className={`course__title course__title--${size}`}>{course.name}</p> */}
      </div>

      <p className={`course__title course__title--${size}`}>{course.name}</p>
      {showBlockEnabled && <p className="course__block">{course.blockId}</p>}
      <div className={`course__semesters`}>
        {Object.keys(course.available_terms).map((key, i) => {
          const semesterItem = key as keyof AvailableTerms;
          if (course.available_terms[semesterItem]) {
            return <SemesterIcon key={i} semester={semesterItem} size={"sm"} />;
          }
          return null;
        })}
      </div>
      {isExpanded?(
      <div className='sectionSelector_container'>
        <SectionSelector 
          course={course} 
          season={season} 
          selectedSections={selectedSections} 
          setSelectedSections={setSelectedSections}
        />
      </div>
      ):<></>
      }
      {Boolean(onRemoveClick) && (
        <div
          className={`course__remove_btn`}
          onClick={(e) => (!!onRemoveClick ? onRemoveClick(e) : {})}
        >
          <SVGIcon name="cross" fill="#ffffff" />
        </div>
      )}
      {/* {isCourseChoix && (
        <ChoixCourseSearch
          isSearchInputActive={isChoixSearchInputActive}
          setIsSearchInputActive={setIsChoixSearchInputActive}
        />
      )} */}
    </div>
  );
};

export default Course;
