import { ICourse } from "./course";

export interface IBlock {
  id: string;
  name: string;
  type: string;
  description: string;
  min: string;
  max: string;
  courses?: string[];
  coursesDetails: ICourse[];
}
