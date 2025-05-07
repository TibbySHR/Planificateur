import { AvailableTermsKeys } from "./availableTerms";
import { ICourse } from "./course";

export interface ISemester {
  id: string;
  title: string;
  season: AvailableTermsKeys;
  credits: number;
  maxCredits: number;
  courses: ICourse[];
}
