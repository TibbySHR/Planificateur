import { AvailableTermsKeys } from "./availableTerms";

export interface IOrientation {
  _id: string;
  name: string;
  segments: string[];
  semesters: {
    season: AvailableTermsKeys;
    courses: { blockId: string; courseId: string }[];
    description: string;
  }[];
}
