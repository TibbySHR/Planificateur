import React, { useContext } from "react";
import "./styles.scss";
import IconButton from "../IconButton/IconButton";
import { t } from "i18next";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import { SchoolContext } from "../../store/contexts/schoolContext";
import ExportButton from "../ExportButton/ExportButton";

const SemesterToolbar = () => {
  const schoolContext = useContext(SchoolContext);
  const CScontext = useContext(CourseSelectionContext);

  const deleteGridAllCourses = () => {
    CScontext.emptyAllSemesters();
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        schoolContext.showToast(t("copied.toast"));
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="semester_toolbar">
      <IconButton
        SVGIconProps={{
          name: "trash",
          width: "22",
          height: "22",
          stroke: "#fb265b",
        }}
        onClick={deleteGridAllCourses}
        tooltip={t("deleteall.tooltip")}
        className="semester_toolbar__button"
      />
      <IconButton
        SVGIconProps={{
          name: "copy",
          viewBox: "0 0 24 24",
          width: "20",
          height: "20",
          stroke: "#29263d",
        }}
        onClick={copyToClipboard}
        tooltip={t("copy.tooltip")}
        className="semester_toolbar__button"
      />
      <ExportButton />
    </div>
  );
};

export default SemesterToolbar;
