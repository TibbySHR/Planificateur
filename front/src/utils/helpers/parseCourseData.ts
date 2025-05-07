import { EventInput } from "@fullcalendar/core";
import moment from "moment";
import { ICourse, ISchedule } from "../../models/course";
import { v4 as uuidv4 } from "uuid";

export const parseCourseData = (
  courses: ICourse[],
  selectedSections:string[],
  courseColors: { [key: string]: string },
  prevEvents: EventInput[]
): EventInput[] => {
  const events: EventInput[] = [...prevEvents];

  const holidays = new Set(["2024-12-25", "2024-01-01"]);
  const dayMapping: { [key: string]: string } = {
    Lu: "Mo",
    Ma: "Tu",
    Me: "We",
    Je: "Th",
    Ve: "Fr",
    Sa: "Sa",
    Di: "Su",
  };

  const coursePaletteIndex = { value: 0 };
  const getNextColor = (): string => {
    const colorPalette = [
      '#2E91E5', '#E15F99', '#1CA71C', '#FB0D0D', '#DA16FF',
      '#222A2A', '#B68100', '#750D86', '#EB663B', '#511CFB',
      '#00A08B', '#FB00D1', '#FC0080', '#B2828D', '#6C7C32',
      '#778AAE', '#862A16', '#A777F1', '#620042', '#1616A7',
      '#DA60CA', '#6C4516', '#0D2A63', '#AF0038',
    ];
    if (coursePaletteIndex.value < colorPalette.length) {
      return colorPalette[coursePaletteIndex.value++];
    }
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Fallback to random color
  };

  courses.forEach((course) => {
    if (!course.schedules) return;

    const courseColor = courseColors[course._id] || getNextColor();

    course.schedules.forEach((schedule) => {
      if (!schedule.sections) return;

      schedule.sections.forEach((section) => {
        if (!section.volets) return;
        if (
          selectedSections.some(section => section.startsWith(course._id))  &&
          !selectedSections.includes(course._id+section.name[0]) 
        ) return

        section.volets.forEach((volet) => {
          if (!volet.activities) return;

          volet.activities.forEach((activity) => {
            if (!activity.days) return;

            const startDate = moment(activity.start_date);
            const endDate = moment(activity.end_date);
            const startTime = moment(activity.start_time, "HH:mm");
            const endTime = moment(activity.end_time, "HH:mm");

            let currentDate = startDate.clone();

            while (currentDate.isSameOrBefore(endDate, "day")) {
              const currentDayEnglish = currentDate.format("dd");

              // Only add events on valid weekdays and non-holidays
              if (
                !["Sa", "Su"].includes(currentDayEnglish) &&
                !holidays.has(currentDate.format("YYYY-MM-DD")) &&
                activity.days.includes(
                  Object.keys(dayMapping).find((key) => dayMapping[key] === currentDayEnglish)!
                )
              ) {
                events.push({
                  id: uuidv4(),
                  title: `${course.name} (${volet.name})`,
                  start: currentDate
                    .clone()
                    .set({
                      hour: startTime.hour(),
                      minute: startTime.minute(),
                    })
                    .toISOString(),
                  end: currentDate
                    .clone()
                    .set({
                      hour: endTime.hour(),
                      minute: endTime.minute(),
                    })
                    .toISOString(),
                  backgroundColor: courseColor,
                  borderColor: courseColor,
                  allDay: false,
                });
              }
              currentDate.add(1, "day");
            }
          });
        });
      });
    });
  });

  return events;
};

export const parseSchedulesData= (
  schedules: ISchedule[],
  selectedSections:string[],
  courseColors: { [key: string]: string },
  prevEvents: EventInput[]
): EventInput[] => {
    const events: EventInput[] = [...prevEvents];

    const holidays = new Set(["2024-12-25", "2024-01-01"]);
    const dayMapping: { [key: string]: string } = {
      Lu: "Mo",
      Ma: "Tu",
      Me: "We",
      Je: "Th",
      Ve: "Fr",
      Sa: "Sa",
      Di: "Su",
    };

    const coursePaletteIndex = { value: 0 };
    const colorPalette = [
      '#2E91E5', '#E15F99', '#1CA71C', '#FB0D0D', '#DA16FF',
      '#222A2A', '#B68100', '#750D86', '#EB663B', '#511CFB',
      '#00A08B', '#FB00D1', '#FC0080', '#B2828D', '#6C7C32',
      '#778AAE', '#862A16', '#A777F1', '#620042', '#1616A7',
      '#DA60CA', '#6C4516', '#0D2A63', '#AF0038',
    ];
    const courseColorMap = new Map<string, string>();
    
    const getColorForCourse = (sigle: string): string => {
      if (!courseColorMap.has(sigle)) {
        const nextColor = coursePaletteIndex.value < colorPalette.length
          ? colorPalette[coursePaletteIndex.value++]
          : `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        courseColorMap.set(sigle, nextColor);
      }
      return courseColorMap.get(sigle)!;
    };
  

    schedules.forEach((schedule) => {
      if (!schedule.sections) return;

      schedule.sections.forEach((section) => {
        if (!section.volets) return;
        if (
          selectedSections.some(section => section.startsWith(schedule.sigle))  &&
          !selectedSections.includes(schedule.sigle+section.name[0]) 
        ) return

        section.volets.forEach((volet) => {
          if (!volet.activities) return;

          volet.activities.forEach((activity) => {
            if (!activity.days) return;

            const startDate = moment(activity.start_date);
            const endDate = moment(activity.end_date);
            const startTime = moment(activity.start_time, "HH:mm");
            const endTime = moment(activity.end_time, "HH:mm");

            let currentDate = startDate.clone();

            while (currentDate.isSameOrBefore(endDate, "day")) {
              const currentDayEnglish = currentDate.format("dd");

              // Only add events on valid weekdays and non-holidays
              if (
                !["Sa", "Su"].includes(currentDayEnglish) &&
                !holidays.has(currentDate.format("YYYY-MM-DD")) &&
                activity.days.includes(
                  Object.keys(dayMapping).find((key) => dayMapping[key] === currentDayEnglish)!
                )
              ) {
                const courseColor = getColorForCourse(schedule.sigle);
                
                events.push({
                  id: uuidv4(),
                  custom:"custom",
                  title: `${schedule.sigle}(${volet.name}) ${schedule.name}`,
                  start: currentDate
                    .clone()
                    .set({
                      hour: startTime.hour(),
                      minute: startTime.minute(),
                    })
                    .toISOString(),
                  end: currentDate
                    .clone()
                    .set({
                      hour: endTime.hour(),
                      minute: endTime.minute(),
                    })
                    .toISOString(),
                  backgroundColor: courseColor,
                  borderColor: courseColor,
                  allDay: false,
                  // ExtededProp.fullName is the information shown in the hover effect of an event.
                  extendedProps: {
                    fullName:schedule.sigle+"("+volet.name+")" +" "+ schedule.name ,
                  }
                });
              }
              currentDate.add(1, "day");
            }
          });
        });
      });
    });

  return events;
};