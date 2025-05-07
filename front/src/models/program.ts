import { IOrientation } from "./orientation";
import { ISegment } from "./segment";

export interface IProgram {
  _id: string;
  name: string;
  segments: ISegment[];
  structure: string;
  orientation: IOrientation[];
}
