# Application

> Framework: React
> Styling: Sass 

## Scheduler

### Main components

#### ProgramFilter
This component allows users to find a program by faculty and department, program, etc.
- Dependencies
- Used by
- Data requirements

#### CourseList
This component display the courses available in a program, grouped by blocks and segments.
- Dependencies: ProgramFilter
- Used by
- Data requirements
Search module
List/Result module

### Course

Represents a single course. It is used in the CourseList to present the courses and can be dragged into a Semester.

- Dependencies
- Used by: CourseList, Semester
- Data requirements

### Semester
Represents a single semester, a droppable area where courses can be dragged and dropped.

- Dependencies
- Used by: GridView
- Data requirements
- Children

### Gridview
A grid layout that organizes the semesters.
- Dependencies
- Used by
- Data requirements
- Children

### ScheduleCalendar
A calendar view showing the schedule of the courses.
- Dependencies
- Used by
- Data requirements

## Calendar

## Styling convention
