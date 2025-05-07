import React, { ReactElement } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const MyTooltip = (props: {
  children: ReactElement;
  tooltipText: string;
  tooltipClassname?: string;
}) => {
  return (
    <>
      <OverlayTrigger
        overlay={
          <Tooltip id={`tooltip-ids`} className={props.tooltipClassname}>
            {props.tooltipText}
          </Tooltip>
        }
      >
        {props.children}
      </OverlayTrigger>
    </>
  );
};

export default MyTooltip;
