import { IBlock } from "./block";

export interface ISegment {
  id: string;
  name: string;
  description: string;
  blocs: IBlock[];
}
