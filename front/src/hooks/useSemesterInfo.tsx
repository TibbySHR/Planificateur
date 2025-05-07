import React from "react";
import { ISemester } from "../models/semester";
import { ICourse } from "../models/course";
import { IAlertMessage } from "../models/alertMessage";
import { t } from "i18next";
import { getWorkingCombinaison, Item } from "../utils/helpers/date_validator";

const useSemesterInfo = (semesters: ISemester[]) => {
  const getTotalCredits = () => {
    return semesters.reduce((total, semester) => {
      return (
        total +
        semester.courses.reduce((sum, course) => {
          return sum + course.credits;
        }, 0)
      );
    }, 0);
  };

  const getSemesterCredits = (semesterId: string) => {
    const semester = semesters.find((s) => s.id === semesterId);
    if (!semester) {
      return 0;
    }
    return semester.courses.reduce((sum, course) => {
      return sum + course.credits;
    }, 0);
  };

  const getSemesterMessages = (semesterId: string): IAlertMessage[] => {
    let found = false;
    let semesterIndex = 0;
    for (semester of semesters) {
      if (semester.id === semesterId) {
        found = true;
        break;
      }
      semesterIndex++;
    }

    if (!found) {
      return [];
    } else {
      var semester: ISemester = semesters[semesterIndex];
    }
    const messages = [];
    const sumCredits = getSemesterCredits(semesterId);
    if (sumCredits > semester.maxCredits)
      messages.push({
        variant: "danger" /*  danger, warning, info */,
        text: `Une trimestre ne peut pas contenir plus de ${semester.maxCredits} crédits.`,
      });

    /* verifie for each course if its requirement are met */
    semester.courses.forEach((course) => {
      if (
        !atLeastOneisPresentBefore(
          course.prerequisite_courses,
          semesterIndex - 1
        )
      ) {
        messages.push({
          variant: "warning" /*  danger, warning, info */,
          text: `${course._id} a un prérequis non satisfait: ${course.prerequisite_courses}`,
        });
      }
      if (
        !atLeastOneisPresentBefore(course.concomitant_courses, semesters.length)
      ) {
        messages.push({
          variant: "warning" /*  danger, warning, info */,
          text: `${course._id} a un concomitant non satisfait: ${course.concomitant_courses}`,
        });
      }
      if (
        !atLeastOneisPresentBefore(course.equivalent_courses, semesterIndex)
      ) {
        messages.push({
          variant: "warning" /*  danger, warning, info */,
          text: `${course._id} a un équivalence non satisfait: ${course.equivalent_courses}`,
        });
      }
      if (!courseIsGivenInSeason(course, semester.season)) {
        let season = t(semester.season);
        messages.push({
          variant: "warning" /*  danger, warning, info */,
          text: `${course._id} n'est pas normalement donné en ${season}`,
        });
      }
    });
    let [isNoOverlap, aWorkingCombinaison]: [boolean, Item[]] =
      getWorkingCombinaison(semester.courses, semester.season);
    if (!isNoOverlap) {
      messages.push({
        variant: "danger" /*  danger, warning, info */,
        text: `Conflit d'horaire inévitable`,
      });
    }

    return messages;
  };

  const courseIsGivenInSeason = (course: ICourse, season: string) => {
    for (let [key, value] of Object.entries(course.available_terms)) {
      if (season === key && value) return true;
    }
    return false;
  };

  const atLeastOneisPresentBefore = (
    courseIds: string[],
    semesterIndex: number
  ) => {
    if (courseIds.length == 0) return true;
    for (let i = semesterIndex; i >= 0; i--) {
      if (!semesters[i]) continue;
      if (
        semesters[i].courses.some((course) => {
          return courseIds.find((foo) => {
            return foo === course._id;
          });
        })
      ) {
        return true;
      }
    }
    return false;
  };

  return { getTotalCredits, getSemesterCredits, getSemesterMessages };
};

export default useSemesterInfo;
