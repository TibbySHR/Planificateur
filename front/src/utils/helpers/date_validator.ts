import {
  IActivity,
  ICourse,
  ISchedule,
  ISection,
  IVolet,
} from "../../models/course";
import _, { over } from "lodash";
// this function return a list of overlap obj of this form:
/*
{ 
	activity1 : <obj> ,  => augmented from original with "(start|end)_time": float
	activity2 : <obj> ,  => augmented from original with "(start|end)_time": float
	type_of_conflict: "<string>",
	date : "string"
}

As input it take a list of activity of this format:

activity = {
_id: "IFT 2015",
day_of_week: "De",
start_date: "2024-06-14",
end_date: "2024-06-20",
start_hour: "11:00",
end_hour: "13:00"
};

 */
/*
interface Activity extends Omit<IActivity, 
  'start_time' | 'end_time' 
  > {
  _id : string
  day_of_week: string;
  start_time: string; 
  end_time: string|number
}
  */
interface Activity extends IActivity {
  _id: string;
  start_timef?: number;
  end_timef?: number;
  day_of_week: string;
}

export type Item = {
  liste: any[];
  name: string;
};
/* defaultItem work similarly to defaultdict of python, but you cannot choose
  the returned object, it is always a list of Item.
  It looks if the key (name) exist, if yes return it corresponding liste,
  if doesnt exist, create the item and return its liste */
const defaultItem = (stack: Item[], name: string): any[] => {
  let item = stack.find((item) => {
    if (item.name === name) {
      return true;
    }
  });
  if (item) {
    return item.liste;
  } else {
    let newItem = { name: name, liste: [] };
    stack.push(newItem);
    return newItem.liste;
  }
};

/* semester need to be one of those choice: A,E or H then two digit (regex form) : [AEH]/d{2} ( french artefact from the db )
this function aggregates all subsection and section into one.
This way, sections A101,A102,A103 activities get put togheter with section A. 
For example, with this list of sections :

[
  A: { TH: [<activities>], final: [ <activities> ] }
  A101:  { TP : [ <activities> ] }
  A102:  { TP : [ <activities> ] }
]

get transform into

[
  { name: A
    liste: [ 
              { name :TH,
                liste: [ { <activities> } ]
              }
              { name :final,
                liste: [ { <activities> } ]
              }
              { name :TP,
                liste: [ {<activities>}, {<activities>} ]
              }
            ]
  }
]
*/
function getThisSeasonSchedule(
  course: ICourse,
  season: string
): ISchedule | undefined {
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = parseInt(currentDate.getFullYear().toString().substring(2));
  // those month are really permissive, better be before then after
  // anyway, the right season will be filterd after
  let thisSeason: string = "";
  let win = [0, 1, 2, 3];
  let sum = [4, 5, 6, 7];
  let aut = [8, 9, 10, 11];
  if (win.includes(currentMonth)) thisSeason = "H" + currentYear.toString();
  if (sum.includes(currentMonth)) thisSeason = "E" + currentYear.toString();
  if (aut.includes(currentMonth)) thisSeason = "A" + currentYear.toString();

  let seasons: string[] = [thisSeason];
  // we have one current season in the list, we want to add the next two.
  for (let i = 2; i > 0; i--) {
    if (!thisSeason) break;
    if (thisSeason[0] === "A") {
      currentYear++;
      let newSeason = "H" + currentYear.toString();
      seasons.push(newSeason);
      thisSeason = newSeason;
    }
    if (thisSeason[0] === "E") {
      let newSeason = "A" + currentYear.toString();
      seasons.push(newSeason);
      thisSeason = newSeason;
    }
    if (thisSeason[0] === "H") {
      let newSeason = "E" + currentYear.toString();
      seasons.push(newSeason);
      thisSeason = newSeason;
    }
  }
  console.log(seasons)

  //On a demandé A/E/H, one retourne donc le X25 correspondant
  let askedSeason = seasons.find((s) => {
    if (s[0] === season[0]) return s;
  });

  // Si, disons A25, n'est pas dispo car trop dans le futur, retourne une liste vide
  let result = course.schedules.find((schedule) => {
    if (schedule.semester === askedSeason) return schedule;
  });
  return result;
}

let wrongOverlap: string[] = [];
export const aggregateSection = (course: ICourse, season: string): Item[] => {
  let mySectionStack: Item[] = [];
  if (!course.schedules) return [];
  if (season === "autumn") season = "A";
  if (season === "winter") season = "H";
  if (season === "summer") season = "E";
  let schedule = getThisSeasonSchedule(course, season);
  if (!schedule) return [];

  schedule.sections.forEach((section) => {
    let allActivities: Activity[] = [];
    let itemSection = defaultItem(mySectionStack, section.name[0]);
    // here, i am in itemSection => { name: A, liste:any[] }
    // i need to append to any[] which will be Item[]
    section.volets.forEach((volet) => {
      for (let activity of volet.activities) {
        for (let day of activity.days) {
          allActivities.push({
            ...activity,
            _id: course._id + "-" + section.name + "-" + volet.name,
            day_of_week: day,
          });
        }
      }
      let itemVolet = defaultItem(itemSection, volet.name);
      itemVolet.push({
        name: course._id + "-" + section.name + "-" + volet.name,
        liste: volet.activities,
      });
    });
    let overlaps = activities_overlap(allActivities);
    if (overlaps.length > 0) {
      for (let overlap of overlaps) {
        wrongOverlap.push(overlap[0]._id + overlap[1]._id);
      }
    }
  });
  /* this return this form:
  [
    { name: A, liste: [ 
                        { name: TH, liste: [<TH volets>]}
                        { name: TP, liste: [<TP volets>, <TP volets>]}
                      ]
    }
    { name: B, liste: 
                        { name: TH, liste: [<TH volets>]}
                        { name: TP, liste: [<TP volets>, <TP volets>]}
                      ]
    }
  ]
  */
  return mySectionStack;
};

export function getWorkingCombinaison(
  courses: ICourse[],
  season: string
): [boolean, Item[]] {
  let aggregCourses: Item[][] = [];
  courses.forEach((course) => {
    // if no available schedule, aggregateSection return empty list
    let foo = aggregateSection(course, season);
    if (foo.length > 0) aggregCourses.push(foo);
  });
  if (aggregCourses.length === 0) return [true, []];
  /*
  aggregCourses for 3 courses with respectively 3,1 and 2 sections:
     [ [a,b,c], [a], [a,b] ]
  */
  // this create a list of combinaison of one section from each courses
  let combinaisons = cartesianProduct(_.cloneDeep(aggregCourses));
  /*
    combinaisons for the previous example:
    [ [a,a,a], [a,a,b], [b,a,a], [b,a,b], [c,a,a], [c,a,b] ]
  */

  // test each combinaison too see if one return no error ( no overlapping )
  //combinaison = [I-A, M-A, S-B] => I,A and S beeing different courses
  //Need to generate the list of activities from one combinaison
  /*
    So for each section, we need to select on "groupe of activities" for each volet,
    normally, we'll have on for TH, Final and intra, which were in section "A".
    But there will be multiple TP, only on need to be tested at a time.
    to see the structure, go see the return format of aggregatCourses function
  */
  for (let combinaison of combinaisons) {
    let volets: Item[] = []; // list of all Item of volet of all section
    // combinaison =>[A,B,C]  ( one section per course )
    for (let section of combinaison) {
      //section => I-A ( one Item )
      for (let volet of section.liste) {
        volets.push(volet); // those volet are the {name:TP, liste:[<activities>,<activites>]} form
      }
    }
    // now we have all the volets of all the section of one combinaison
    // We need to make a cartesian product of all the possible combinaison of groupe within a volet
    // most volet has only one group (TH, final, intra), but TP can have many. because of our
    // original aggregation of subsection
    /*
    { name: A, liste: [ 
                        { name: TH, liste: [<TH volets>]}
                        { name: TP, liste: [<TP volets>, <TP volets>]}
                      ]
    }
    */
    let groupecombinaisons = cartesianProduct(volets.map((v) => v.liste));
    for (let oneGroupePerVolet of groupecombinaisons) {
      let activities = oneGroupePerVolet.flatMap((oneGroupe) =>
        retrieveActivites(oneGroupe)
      );
      if (activities.length === 0) return [true, []];
      let overlaps = activities_overlap(activities);

      let trueOverlaps = [];
      for (let overlap of overlaps) {
        if (!wrongOverlap.includes(overlap[0]._id + overlap[1]._id)) {
          trueOverlaps.push(overlap);
        }
      }

      // if no overlap found ( list is empty ) return the combinaison that worked
      if (trueOverlaps.length === 0) return [true, combinaison];
    }
  }
  // If overlap found on each combinaison, return an empty list
  // which mean no working combinaison works
  return [false, []];
}
function retrieveActivites(volet: any): Activity[] {
  let activities: Activity[] = [];
  volet.liste.forEach((activity: IActivity) => {
    activity.days.forEach((day) => {
      activities.push({
        ...activity,
        _id: volet.name,
        day_of_week: day,
      } as Activity);
    });
  });
  return activities;
}

function activities_overlap(
  activities_list: Activity[]
): [Activity, Activity][] {
  // Convert day of week to a numerical value (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const days_of_week = ["De", "Lu", "Ma", "Me", "Je", "Ve", "Sa"]; // bucket sort by day of the week
  const buckets: { [key: number]: Activity[] } = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  // put activities in correct bucket
  for (let activity of activities_list) {
    let index = days_of_week.indexOf(activity.day_of_week);
    activity.start_timef = parseFloat(activity.start_time.replace(":", "."));
    activity.end_timef = parseFloat(activity.end_time.replace(":", "."));
    if (index === -1) {
      continue;
    }
    buckets[index].push(activity);
  }

  // sorting the buckets by start HOUR
  for (const bucket of Object.values(buckets)) {
    bucket.sort((elem1, elem2) => {
      if (!!elem1.start_timef && !!elem2.start_timef)
        return elem1.start_timef - elem2.start_timef;
      return 0;
    });
  }

  // overlap edge case TODO
  const overlaps: [Activity, Activity][] = [];
  for (let bucket of Object.values(buckets)) {
    for (let i = 0; i < bucket.length; i++) {
      let a1 = bucket[i];
      for (let j = i + 1; j < bucket.length; j++) {
        let a2 = bucket[j];
        if (a1.start_time === a1.end_time || a2.start_time === a2.end_time)
          continue;
        if (doesOverlap(a1, a2)) {
          overlaps.push([a1, a2]);
        }
      }
    }
  }
  return overlaps;
}
function doesOverlap(a1: Activity, a2: Activity) {
  if (doesDateOverlap(a1, a2) && doesTimeOverlap(a1, a2)) {
    return true;
  }

  return false;
}
function doesDateOverlap(a1: Activity, a2: Activity) {
  let a1Start = new Date(a1.start_date);
  let a2Start = new Date(a2.start_date);

  let a1End = new Date(a1.end_date);
  let a2End = new Date(a2.end_date);

  if (a1End > a2Start && a1Start <= a2Start) {
    return true;
  }
  if (a1End <= a2End && a1Start >= a2Start) {
    return true;
  }
  if (a1End >= a2End && a1Start < a2End) {
    return true;
  }

  return false;
}
function doesTimeOverlap(a1: Activity, a2: Activity) {
  if (!a1.start_timef || !a1.end_timef || !a2.start_timef || !a2.end_timef) {
    return [];
  }

  let a1Start = a1.start_timef;
  let a2Start = a2.start_timef;

  let a1End = a1.end_timef;
  let a2End = a2.end_timef;

  if (a1End > a2Start && a1Start <= a2Start) {
    return true;
  }
  if (a1End <= a2End && a1Start >= a2Start) {
    return true;
  }
  if (a1End >= a2End && a1Start < a2End) {
    return true;
  }

  return false;
}

function cartesianProduct<T>(a: T[][]): T[][] {
  // a = array of array
  var a1: T[];
  var o: T[][] = [];
  if (!a || a.length == 0) return a;

  a1 = a.splice(0, 1)[0]; // the first array of a
  a = cartesianProduct(a);
  for (const elem1 of a1) {
    if (a && a.length !== 0) {
      for (const elem of a) {
        o.push([elem1].concat(elem));
      }
    } else {
      o.push([elem1]);
    }
  }
  return o;
}
