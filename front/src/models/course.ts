import { AvailablePeriods } from "./availablePeriods";
import { AvailableTerms } from "./availableTerms";

export interface IActivity {
  days: string[];
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
  campus: string;
  place: string;
  pavillon_name: string;
  room?: string;
  mode: string;
}

export interface IVolet {
  name: string;
  activities: IActivity[];
}

export interface ISchedule {
  _id: string;
  sigle: string;
  name: string;
  semester: string;
  sections: ISection[];
  fetch_date: string;
  semester_int: number;
}

export interface ISection {
  name: string;
  capacity: number;
  number_inscription: number;
  teachers: string[];
  volets: IVolet[];
}

export interface ICourse {
  _id: string;
  blockId?: string;
  code?: string;
  number?: string;
  name: string;
  description: string;
  credits: number;
  available_terms: AvailableTerms;
  available_periods: AvailablePeriods;
  requirement_text: string;
  prerequisite_courses: string[];
  concomitant_courses: string[];
  equivalent_courses: string[];
  schedules: ISchedule[];  // Included with courses
}
