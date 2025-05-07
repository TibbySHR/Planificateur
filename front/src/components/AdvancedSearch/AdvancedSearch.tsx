import { Button } from "react-bootstrap";
import React, { useContext, useState, useCallback, useMemo } from "react";
import { search } from "../../utils/APIs";
import Form from "../Form/Form";
import { FormField, FormFieldType } from "../../models/FormField";
import ScheduleCalendar from "../ScheduleCalendar/ScheduleCalendar";
import { parseCourseData, parseSchedulesData } from "../../utils/helpers/parseCourseData";
import { ICourse, ISchedule } from "../../models/course";
import { EventInput } from "@fullcalendar/core";
import { useTranslation } from "react-i18next";
import "./styles.scss"; // Custom styles

const AdvancedSearch = () => {
    const { t } = useTranslation();
    const [searchString, setSearchString] = useState("");
    const [isValid, setIsValid]= useState(true)
    const [courseColors, setCourseColors] = useState<{ [key: string]: string }>({});
    const [events, setEvents] = useState<EventInput[]>([]);

    // Memoize search form to prevent recalculating on every render

    // Update courses and events after search button is clicked
    const handleSearch = useCallback(async (newValue:string) => {
        if (!newValue) {
            return;
        }
        newValue = newValue.trim()
        // If the input is the same then the one inplace, do nothing.
        if (newValue === searchString){
            setIsValid(true);
            return;
        }
        try {
            const schedules: ISchedule[] = await search(newValue);
            // Update events based on the newly fetched courses
            const newEvents = parseSchedulesData(schedules,[], courseColors, []);
            setEvents(newEvents);
            setIsValid(true)
            setSearchString(newValue)

        } catch (error:any) {
            if (
                error.response?.status === 400 &&
                error.response?.data?.detail === "Invalid AST input"
            ){
                setIsValid(false)
                console.log("Not a valid AST input.")
            }else{
                setIsValid(false)
                alert("Search failed")
            }
        }
    }, [searchString, courseColors]);

    const searchForm: FormField[] = useMemo(
        () => [
            {
                id: "search",
                label: t("advancedSearch.title"),
                type: FormFieldType.Text,
                value: searchString,
                onChange: handleSearch,
                error: !isValid,
            },
        ],
        [searchString,isValid]
    );

    return (
        <div className="advanced-search-container">
            <div className="search-form-container">
                <Form fields={searchForm} className="search-advanced-form" />
            </div>
            <div className="calendar-section">
                <ScheduleCalendar events={events} />
            </div>
        </div>
    );
};

export default AdvancedSearch;
