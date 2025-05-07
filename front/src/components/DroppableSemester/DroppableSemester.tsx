import React, { MouseEvent, useContext, useState, useEffect } from "react";
import "./styles.scss";
import { StrictModeDroppable } from "../StrictModeDroppable/StrictModeDroppable";
import DraggableCourse from "../DraggableCourse/DraggableCourse";
import SemesterIcon from "../SemesterIcon/SemesterIcon";
import IconButton from "../IconButton/IconButton";
import AlertMessageStack from "../AlertMessageStack/AlertMessageStack";
import SVGIcon from "../SVGIcon/SVGIcon";
import ScheduleCalendar from "../ScheduleCalendar/ScheduleCalendar";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import { ISemester } from "../../models/semester";
import { useTranslation } from "react-i18next";
import { EventInput } from "@fullcalendar/core";
import { parseCourseData } from "../../utils/helpers/parseCourseData";
import { ICourse } from "../../models/course";
import { AvailableTermsKeys } from "../../models/availableTerms";
import { spawn } from "child_process";

interface DroppableSemesterProps {
  prefix: string;
  semesterData: ISemester & { courses: ICourse[] };
  isExpanded: boolean;
  isShrinked: boolean;
  onToggleExpandSemester: () => void;
}

const DroppableSemester = (props: DroppableSemesterProps) => {
  const { t } = useTranslation();
  const CSContext = useContext(CourseSelectionContext);

  const {
    prefix,
    semesterData,
    onToggleExpandSemester,
    isExpanded,
    isShrinked,
  } = props;

  const [renderKey, setRenderKey] = useState(0);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [courseColors, setCourseColors] = useState<{ [key: string]: string }>(
    {}
  );

  const semesterMessages = CSContext.getSemesterMessages(semesterData.id);

  const [selectedSections, setSelectedSections] = useState<string[]>([])

  useEffect(() => {
    const courseEvents = parseCourseData(
      semesterData.courses,
      selectedSections,
      courseColors,
      []
    );
    setEvents(courseEvents);
  }, [JSON.stringify(semesterData.courses), selectedSections]);

  // Code can be used later for advanced coloring based on live events from the options like coloring based on the volet or just code
  // useEffect(() => {
  //   // Generate colors for courses and volets
  //   const generateColors = () => {
  //     const colors: { [key: string]: string } = {};
  //     semesterData.courses.forEach((course) => {
  //       if (!colors[course._id]) {
  //         colors[course._id] = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Random color
  //       }
  //       course.schedules.forEach((schedule) => {
  //         schedule.sections.forEach((section) => {
  //           section.volets.forEach((volet) => {
  //             if (!colors[volet.name]) {
  //               colors[volet.name] = `#${Math.floor(Math.random()*16777215).toString(16)}`;
  //             }
  //           });
  //         });
  //       });
  //     });
  //     setCourseColors(colors);
  //   };
  //   debugger;
  //   generateColors();
  // }, [semesterData.courses]);

  const onChangeSemesterSeason = (season: AvailableTermsKeys) => {
    console.log("Change season to:", season, " semester:", semesterData.id);
    CSContext.setSemesterSeason(semesterData.id, season);
  };

  return (
    <StrictModeDroppable droppableId={prefix} key={prefix} direction="vertical">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`semester semester--${semesterData.season} ${semesterMessages.length > 0 && "semester--errored"
            } ${isExpanded
              ? "semester--expanded"
              : isShrinked
                ? "semester--shrinked"
                : ""
            }`}
        >
          <div className="semester__header">
            <SemesterIcon
              semester={semesterData.season}
              size="md"
              onChangeSeason={onChangeSemesterSeason}
            />
            <p className="semester__title">
              {semesterData.title}
              <span className="semester__credits">
                ({CSContext.getSemesterCredits(semesterData.id)} crédits)
              </span>
            </p>
            {semesterMessages.length > 0 && (
              <div
                className="semester__error_icon"
                onClick={() => setRenderKey((prevKey) => (prevKey + 1) % 3)}
              >
                <SVGIcon
                  name="message_error"
                  viewBox="0 0 24 24"
                  stroke="red"
                />
              </div>
            )}
          </div>

          <AlertMessageStack key={renderKey} messages={semesterMessages} />

          <div
            className={`semester__body ${isExpanded && "semester__body--expanded"
              }`}
          >
            <div
              className={`semester__courses ${isExpanded && "semester__courses--column"
                }`}
            >
              {semesterData.courses.length > 0 ? (
                <>
                {semesterData.courses.map((item, index) => (
                  <DraggableCourse
                    key={item._id}
                    course={item}
                    index={index}
                    onRemoveClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      CSContext.deleteCourseFromSemester(
                        semesterData.id,
                        item._id
                      );
                    }}
                    size="sm"
                    isExpanded={isExpanded}
                    season={semesterData.season.toString()}
                    selectedSections = {selectedSections}
                    setSelectedSections = {setSelectedSections}
                  />
                ))}
                {/* Extra zone if needed */}
                {isExpanded? (<></>):<></>}
              </>) : (
                <p className="semester__course_empty">
                  {t("semester.drop_message")}
                </p>
              )}
            </div>
            {isExpanded && (
              <div className="semester__calendar">
                <ScheduleCalendar events={events} semesterData={semesterData} />
              </div>
            )}
          </div>
          <IconButton
            SVGIconProps={{
              name: "resize",
              width: "20",
              height: "20",
              viewBox: "0 0 36 36",
            }}
            className="semester__calendar_icon_btn"
            onClick={onToggleExpandSemester}
            tooltip={
              isExpanded
                ? t("semester.resize.collapse")
                : t("semester.resize.expand")
            }
          />

          {semesterData.courses.length > 0 && (
            <IconButton
              SVGIconProps={{
                name: "trash",
                width: "22",
                height: "22",
                stroke: "#fb265b",
              }}
              className="semester__trash_icon_btn"
              onClick={() =>
                CSContext.deleteAllSemesterCourses(semesterData.id)
              }
              tooltip={t("semester.remove.button")}
            />
          )}

          {provided.placeholder}
        </div>
      )}
    </StrictModeDroppable>
  );
};

export default DroppableSemester;
