import { CalendarEvent } from "./calendar-event";

export interface CalendarCell {
    date: Date;
    event?: CalendarEvent;
}
