import { NavigateFunction } from "react-router-dom";
import { ISemester } from "../../models/semester";
import {
  getDefaultInitialSemester,
  getInitialSemesters,
  getSemesterSeasonBasedonIndex,
  isValidSeason,
} from "../../store/helpers/courseSelectionHelpers";

export const updateURLQueryParams = (
  programId: string,
  semesters: ISemester[],
  orientationId: string,
  navigate: NavigateFunction,
  searchParams: URLSearchParams
) => {
  updateProgramInUrl(programId, searchParams);
  updateTermsInUrl(semesters, searchParams);
  updateOrientationInUrl(orientationId, searchParams);
  navigate({ search: searchParams.toString() });
};

const updateProgramInUrl = (
  programId: string,
  searchParams: URLSearchParams
) => {
  searchParams.set("program", programId);
};

export const fetchProgramFromUrl = (searchParams: URLSearchParams) => {
  const programId = searchParams.get("program");
  return programId || "";
};

const updateOrientationInUrl = (
  orientationId: string,
  searchParams: URLSearchParams
) => {
  searchParams.set("orientation", orientationId);
};

export const fetchOrientationFromUrl = (searchParams: URLSearchParams) => {
  const programId = searchParams.get("orientation");
  return programId || "";
};

const updateTermsInUrl = (
  semesters: ISemester[],
  searchParams: URLSearchParams
) => {
  const termsString = semesters
    .map((semester) => {
      const coursesString = semester.courses
        .map((course) => `${course.blockId}_${course._id}`)
        .join(",");
      return `${semester.season}:${coursesString}`;
    })
    .join(";");

  searchParams.set("terms", termsString);
};

export const fetchTermsFromURL = (searchParams: URLSearchParams) => {
  const terms = searchParams.get("terms");

  return terms || "";
};

export const constructSemestersBasedonURL = (urlTerms: string) => {
  return urlTerms
    ? urlTerms.split(";").map((term: string, index: number) => {
        const [seasonStr, coursesStr] = term.split(":");
        const season = isValidSeason(seasonStr)
          ? seasonStr
          : getSemesterSeasonBasedonIndex(index);

        return getDefaultInitialSemester(index, season);
      })
    : getInitialSemesters();
};

export const parseTermsInUrl = (urlTerms: string) => {
  return urlTerms.split(";").map((term: string, index: number) => {
    const [seasonStr, coursesStr] = term.split(":");
    const season = isValidSeason(seasonStr)
      ? seasonStr
      : getSemesterSeasonBasedonIndex(index);

    const courses = coursesStr
      ? coursesStr.split(",").map((course) => {
          const [blockId, courseId] = course.split("_");
          return { blockId, courseId };
        })
      : [];

    return { season, courses };
  });
};
