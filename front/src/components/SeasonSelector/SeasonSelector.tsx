import React from "react";
import { AvailableTermsKeys } from "../../models/availableTerms";
import SemesterIcon from "../SemesterIcon/SemesterIcon";
import "./styles.scss";

const SeasonSelector = (props: {
  selectedSeason: AvailableTermsKeys;
  onSelect: (season: AvailableTermsKeys) => void;
  className?: string;
}) => {
  const { selectedSeason, onSelect, className = "" } = props;

  const seasons: AvailableTermsKeys[] = [
    AvailableTermsKeys.Autumn,
    AvailableTermsKeys.Winter,
    AvailableTermsKeys.Summer,
  ];

  const onSelectSeason = (season: AvailableTermsKeys) => {
    if (season !== selectedSeason) {
      onSelect(season);
    }
  };

  return (
    <div className={`season-selector ${className}`}>
      {seasons.map((season, i) => {
        return (
          <SemesterIcon
            semester={season}
            size="md"
            key={i}
            className={`season-selector__icon ${
              selectedSeason === season ? "season-selector__icon--selected" : ""
            }`}
            onClick={() => onSelectSeason(season)}
          />
        );
      })}
    </div>
  );
};

export default SeasonSelector;
