import React, { useState, useRef, forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import DatePicker from "react-datepicker";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { ISemester } from "../../models/semester";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.scss";
import { AvailableTermsKeys } from "../../models/availableTerms";

interface ScheduleCalendarProps {
  events: EventInput[];
  semesterData?: ISemester; // Optional semesterData prop
}

// Helper function to determine the initial date based on semester data (if needed)
const getInitialDate = (semesterData: ISemester | undefined): Date => {
  if (!semesterData) return new Date();

  const season = semesterData.season;
  const trimester = semesterData.title.split(" ")[1];
  const today = new Date();
  let year = today.getFullYear();

  switch (trimester) {
    case "1":
      year = today.getFullYear();
      break;
    case "2":
    case "3":
    case "4":
      year = today.getFullYear() + 1;
      break;
    case "5":
    case "6":
    case "7":
      year = today.getFullYear() + 2;
      break;
    case "8":
    case "9":
    case "10":
      year = today.getFullYear() + 3;
      break;
    case "11":
    case "12":
      year = today.getFullYear() + 4;
      break;
  }

  let month = 0;
  switch (season) {
    case AvailableTermsKeys.Autumn:
      month = 8; // September
      break;
    case AvailableTermsKeys.Winter:
      month = 0; // January
      break;
    case AvailableTermsKeys.Summer:
      month = 4; // May
      break;
  }
  return new Date(year, month, 1);
};

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ events, semesterData }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate(semesterData));
  const calendarRef = useRef<FullCalendar | null>(null);

  // Handle date change from DatePicker
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.gotoDate(date); // Programmatically change the calendar date
      }
    }
  };

  return (
    <div className="calendar-container">
        <DatePicker
          showIcon
          selected={selectedDate}
          closeOnScroll={true}
          onChange={handleDateChange}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="date-picker"
        />

      <FullCalendar
        ref={calendarRef} // Add a ref to access FullCalendar's API
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        editable={false}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        handleWindowResize={true}
        slotMinTime="07:30:00" // Start time for the calendar
        slotMaxTime="22:00:00" // End time for the calendar
        displayEventTime={true}
        contentHeight="auto"
        events={events} // Pass your events data here
        eventDidMount={(info) => {
          // ✅ Native tooltip
          info.el.setAttribute("title", info.event.extendedProps.description || info.event.extendedProps.fullName);
          // 🔍 Debug to check if it’s firing
        }}
      />
    </div>
  );
};

export default ScheduleCalendar;
