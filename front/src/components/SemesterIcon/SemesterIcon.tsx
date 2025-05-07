import React, { useState } from "react";
import "./styles.scss";
import SVGIcon from "../SVGIcon/SVGIcon";
import {
  AvailableTermsKeys,
  TermIconBackgroundColors,
  TermIcons,
} from "../../models/availableTerms";
import SeasonSelector from "../SeasonSelector/SeasonSelector";

type SemesterIconProps = {
  semester: AvailableTermsKeys;
  size: string;
  className?: string;
  onClick?: () => void;
  onChangeSeason?: (season: AvailableTermsKeys) => void;
};

const SemesterIcon = (props: SemesterIconProps) => {
  const {
    semester,
    size,
    className = "",
    onClick = () => {},
    onChangeSeason,
  } = props;

  const [isSeasonSelectorVisible, setIsSeasonSelectorVisible] = useState(false);

  return (
    <div
      className={`semester_icon ${className} ${
        size === "lg" && "semester_icon--large"
      } ${size === "sm" && "semester_icon--small"}`}
      style={{
        backgroundColor: TermIconBackgroundColors[semester] || "#fff",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsSeasonSelectorVisible(true)}
      onMouseLeave={() => setIsSeasonSelectorVisible(false)}
    >
      {!!onChangeSeason && (
        <div
          className={`semester_icon__selector ${
            !isSeasonSelectorVisible && "semester_icon__selector--hide"
          }`}
        >
          <SeasonSelector selectedSeason={semester} onSelect={onChangeSeason} />
        </div>
      )}
      <SVGIcon name={TermIcons[semester]} className="semester_icon__svg" />
    </div>
  );
};

export default SemesterIcon;
