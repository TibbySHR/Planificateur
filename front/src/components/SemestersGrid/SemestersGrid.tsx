import React, { useContext, useEffect, useState } from "react";
import DroppableSemester from "../DroppableSemester/DroppableSemester";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import { useTranslation } from "react-i18next";
import { Placeholder } from "react-bootstrap";
import "./styles.scss";
import SemesterToolbar from "../SemesterToolbar/SemesterToolbar";

function SemestersGrid() {
  const { semesters, getTotalCredits, maxCredits } = useContext(
    CourseSelectionContext
  );
  const CScontext = useContext(CourseSelectionContext);
  const totalCredits = getTotalCredits();
  const { t } = useTranslation();

  const [expandedCol, setExpandedCol] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    disableLoadingWithTimer();
  }, [CScontext.semesters.length]);

  const disableLoadingWithTimer = () => {
    CScontext.semesters.length > 0 &&
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
  };

  const totalCreditsClass = () => {
    if (totalCredits === maxCredits) {
      return "semesters__total_credits--success";
    } else if (totalCredits > maxCredits) {
      return "semesters__total_credits--error";
    }
    return "";
  };

  const handleToggleExpandSemester = (index: number) => {
    setExpandedCol(expandedCol === index ? null : index);
  };

  const renderSemesters = () => {
    return semesters.map((semester, index) => {
      const isExpanded = expandedCol === index;
      const isShrinked = expandedCol !== null && !isExpanded;

      return (
        <DroppableSemester
          semesterData={semester}
          prefix={semester.id}
          key={semester.id}
          onToggleExpandSemester={() => handleToggleExpandSemester(index)}
          isExpanded={isExpanded}
          isShrinked={isShrinked}
        />
      );
    });
  };

  const renderGridSkeletonLoading = () => {
    const numberOfElements = 12;
    return (
      <div className="semesters__grid semesters__grid_skeleton">
        {Array.from({ length: numberOfElements }, (_, index) => (
          <Placeholder
            key={index}
            as={"div"}
            animation="glow"
            className="semesters__skeleton_item skeleton_bg_animation"
          />
        ))}
      </div>
    );
  };

  return isLoading ? (
    renderGridSkeletonLoading()
  ) : (
    <div className="semesters">
      <div className="semesters__header">
        <div className={`semesters__total_credits ${totalCreditsClass()}`}>
          {t("total_credit")} : {totalCredits}/{maxCredits}
        </div>
        <SemesterToolbar />
      </div>
      <div className="semesters__grid">{renderSemesters()}</div>
    </div>
  );
}

export default SemestersGrid;
