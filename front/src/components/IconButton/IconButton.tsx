import React, { CSSProperties, MouseEvent } from "react";
import SVGIcon from "../SVGIcon/SVGIcon";
import "./styles.scss";
import MyTooltip from "../MyTooltip/MyTooltip";

const IconButton = (props: {
  SVGIconProps: {
    name: string;
    width?: string;
    height?: string;
    stroke?: string;
    fill?: string;
    viewBox?: string;
    text?: string;
    style?: CSSProperties;
  };
  title?: string;
  tooltip?: string;
  onClick: (e?: MouseEvent) => void;
  className?: string;
}) => {
  const renderContent = () => (
    <div
      className={`icon-button ${props.className}`}
      style={props.SVGIconProps.style}
      onClick={props.onClick}
    >
      <SVGIcon {...props.SVGIconProps} />
      {props.title && <span className="icon-button__text">{props.title}</span>}
    </div>
  );

  return props.tooltip ? (
    <MyTooltip tooltipText={props.tooltip}>{renderContent()}</MyTooltip>
  ) : (
    renderContent()
  );
};

export default IconButton;
