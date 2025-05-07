import React, { useContext, useState } from "react";
import "./styles.scss";
import Collapsible from "../Collapsible/Collapsible";
import CreditInfoBox from "../CreditInfoBox/CreditInfoBox";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import { Placeholder } from "react-bootstrap";
import ProgramCourseList from "../ProgramCourseList/ProgramCourseList";
import { ISegment } from "../../models/segment";
import { SchoolContext } from "../../store/contexts/schoolContext";
import IconButton from "../IconButton/IconButton";

const CollapsibleList = () => {
  const schoolContext = useContext(SchoolContext);
  const CScontext = useContext(CourseSelectionContext);

  const [blockExpandedStates, setBlockExpandedStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleExpandChange = (blockId: string, isExpanded: boolean) => {
    setBlockExpandedStates((prevState) => ({
      ...prevState,
      [blockId]: isExpanded,
    }));
  };

  const outerListCollapsibleConfig = {
    duration: 700,
    easing: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
  };
  const innerListCollapsibleConfig = {
    duration: 300,
  };

  const outerHeaderIconProps = {
    name: "arrowDown",
    width: "30",
    height: "30",
    class: "collabsible_list__header_icon__outer",
    expandedClass: "collabsible_list__header_icon__outer--expanded",
    expandedStroke: "#215292",
  };

  const innerHeaderIconProps = {
    name: "plus",
    expandedName: "minus",
    width: "18",
    height: "18",
    class: "collabsible_list__header_icon",
    fill: "#4b545e",
    expandedFill: "#e0ecfa",
  };

  const renderSkeletonsLoading = () => {
    return (
      <Placeholder
        as={"div"}
        animation="glow"
        className="collabsible_list collabsible_list__skeleton skeleton_bg_animation"
      />
    );
  };

  const isSegmentDisplayedForCurrentOrientation = (segmentId: string) => {
    const orientation = schoolContext.selectedOrientation;

    if (orientation && orientation.segments.length > 0) {
      return orientation.segments.includes(segmentId);
    }

    // Either orientation is not valid, or the segments are empty, so we show them all.
    return true;
  };

  const OpenPopup = (message: JSX.Element) => {
    schoolContext.togglePopUp(true, message);
  };

  let structureMsg: string;
  if (!CScontext.programSegments?.structure) {
    structureMsg = "";
  } else {
    structureMsg = CScontext.programSegments?.structure;
  }

  const segmentHeaderTitle = (segment: ISegment) => (
    <div className="collabsible_list__title">
      <span
        className="collabsible_list__header_title_id"
        onClick={() => OpenPopup(<>{segment.description}</>)}
      >
        {segment.id}
      </span>
      <span className="collabsible_list__header_subtitle">{segment.name}</span>
    </div>
  );

  return CScontext.programSegments ? (
    <div className="collabsible_list custom_scrollbar">
      <div className="collabsible_list__header">
        {/* <div
          className="collabsible_list__header_info"
          onClick={() => OpenPopup(<>{structureMsg}</>)}
        >
          i
        </div> */}
        <span className="collabsible_list__header_title">
          {CScontext.program?.name}
        </span>
        <IconButton
          SVGIconProps={{
            name: "exclamation",
            width: "25",
            height: "25",
            viewBox: "0 0 16 16",
            fill: "#686868",
          }}
          onClick={() => OpenPopup(<>{structureMsg}</>)}
          className="collabsible_list__header_info"
        />
      </div>
      <>
        {CScontext.programSegments.segments.map((segment) => {
          const isDisplayedSegment = isSegmentDisplayedForCurrentOrientation(
            segment.id
          );

          return isDisplayedSegment ? (
            <Collapsible
              id={segment.id}
              collapse_config={outerListCollapsibleConfig}
              headerTitle={segmentHeaderTitle(segment)}
              headerClass="collabsible_list__outer_header"
              headerExpandedClass="collabsible_list__outer_header--expanded"
              headerIcon={outerHeaderIconProps}
            >
              {segment.blocs.map((block, j) => {
                const isNameEmpty = !block.name;
                const isAuxChoix = block.type.toLowerCase() === "choix";
                return (
                  <Collapsible
                    key={block.id}
                    collapse_config={innerListCollapsibleConfig}
                    headerTitle={
                      <div className="collabsible_list__title">
                        <span
                          className="collabsible_list__header_title_id"
                          onClick={() => OpenPopup(<>{block.description}</>)}
                        >
                          {block.id}
                        </span>
                        <span className="collabsible_list__header_subtitle">
                          {isNameEmpty && isAuxChoix ? (
                            <span>Cours aux choix</span>
                          ) : (
                            <span>{block.name}</span>
                          )}
                        </span>
                        <CreditInfoBox
                          blockId={block.id}
                          type={block.type}
                          credits={{
                            min: Number(block.min),
                            max: Number(block.max),
                          }}
                        />
                      </div>
                    }
                    headerClass="collabsible_list__inner_header"
                    headerExpandedClass="collabsible_list__inner_header--expanded"
                    contentClass="collabsible_list__inner_content"
                    headerIcon={innerHeaderIconProps}
                    onExpandChange={(isExpanded: boolean) =>
                      handleExpandChange(block.id, isExpanded)
                    }
                  >
                    <ProgramCourseList
                      courses={block.coursesDetails}
                      blockExpandedStates={blockExpandedStates}
                      droppableId={block.id}
                    />
                  </Collapsible>
                );
              })}
            </Collapsible>
          ) : null;
        })}
      </>
    </div>
  ) : (
    renderSkeletonsLoading()
  );
};

export default CollapsibleList;
