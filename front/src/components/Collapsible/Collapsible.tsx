import React, { ReactNode, useEffect } from "react";
import { useCollapse } from "react-collapsed";
import "./styles.scss";
import SVGIcon from "../SVGIcon/SVGIcon";

type CollapsibleProps = {
  id?: string;
  children: ReactNode;
  headerTitle: string | ReactNode;
  headerClass?: string;
  headerExpandedClass?: string;
  contentClass?: string;
  contentExpandedClass?: string;
  collapse_config?: object;
  headerIcon?: {
    name: string;
    expandedName?: string;
    width?: string;
    height?: string;
    class?: string;
    expandedClass?: string;
    fill?: string;
    expandedFill?: string;
    stroke?: string;
    expandedStroke?: string;
  };
  onExpandChange?: (isExpanded: boolean) => void;
};

const defaultProps = {
  id: "",
  headerClass: "",
  headerExpandedClass: "",
  contentClass: "",
  contentExpandedClass: "",
  collapse_config: {},
  headerIcon: {
    name: "",
    expandedName: "",
    width: "",
    height: "",
    class: "",
    expandedClass: "",
    fill: "",
    expandedFill: "",
    stroke: "",
    expandedStroke: "",
  },
  onExpandChange: () => void 0,
};

const Collapsible = (props: CollapsibleProps) => {
  const {
    children,
    headerTitle,
    headerClass,
    headerExpandedClass,
    contentClass,
    contentExpandedClass,
    collapse_config,
    headerIcon,

    onExpandChange,
  } = { ...defaultProps, ...props };

  const { getCollapseProps, getToggleProps, isExpanded } =
    useCollapse(collapse_config);

  useEffect(() => {
    onExpandChange(isExpanded);
  }, [isExpanded]);

  return (
    <div className="collapsible">
      <div
        className={`collapsible__header ${headerClass} ${
          isExpanded && headerExpandedClass
        }`}
        {...getToggleProps()}
      >
        <div className="collapsible__header_title">{headerTitle}</div>
        {headerIcon.name && (
          <div className="collapsible__header_icon">
            <SVGIcon
              name={
                isExpanded && headerIcon.expandedName
                  ? headerIcon.expandedName
                  : headerIcon.name
              }
              width={headerIcon.width}
              height={headerIcon.height}
              className={`${headerIcon.class} ${
                isExpanded && headerIcon.expandedClass
              }`}
              stroke={
                isExpanded ? headerIcon.expandedStroke : headerIcon.stroke
              }
              fill={isExpanded ? headerIcon.expandedFill : headerIcon.fill}
            />
          </div>
        )}
      </div>
      <div {...getCollapseProps()}>
        <div
          className={`collapsible__content ${contentClass} ${
            isExpanded && contentExpandedClass
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Collapsible;
