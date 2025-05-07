import { IProgram } from "./program";

export interface IDepartment {
  _id: string;
  name: string;
  programs: IProgram[];
}
