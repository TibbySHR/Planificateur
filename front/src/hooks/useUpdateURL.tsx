import React, { useEffect } from "react";
import { IOrientation } from "../models/orientation";
import { ISemester } from "../models/semester";
import { updateURLQueryParams } from "../utils/helpers/url";
import { useNavigate, useSearchParams } from "react-router-dom";

const useUpdateURL = (
  semesters: ISemester[],
  orientation: IOrientation | null,
  programId: string
) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const semesterURLTrackedData = semesters.map(({ season, courses }) => ({
    season,
    courses,
  }));

  useEffect(() => {
    if (programId && orientation && Boolean(semesters.length)) {
      updateURLQueryParams(
        programId,
        semesters,
        orientation._id,
        navigate,
        searchParams
      );
    }
  }, [JSON.stringify(semesterURLTrackedData), orientation, programId]);

  return {};
};

export default useUpdateURL;
