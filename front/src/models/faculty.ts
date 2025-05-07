import { IDepartment } from "./department";

export interface IFaculty {
  _id: string;
  name: string;
  departments: IDepartment[];
}
