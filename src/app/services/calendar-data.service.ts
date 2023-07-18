import { Injectable } from '@angular/core';
import { CalendarEvent } from '../models/calendar-event';
import { Subject } from 'rxjs';
import getDateFromString from '../utils/RussianDate';

@Injectable({
  providedIn: 'root',
})
export class CalendarDataService {
  calendarData: CalendarEvent[] = [];
  newDataSubject = new Subject<void>();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    this.calendarData = JSON.parse(
      localStorage.getItem('calendarData') || '[]'
    ).map((ev: CalendarEvent) => ({
      ...ev,
      date: new Date(ev.date),
    })) as CalendarEvent[];
  }

  private saveToLocalStorage() {
    localStorage.setItem('calendarData', JSON.stringify(this.calendarData));
  }

  addEvent(event: CalendarEvent) {
    let oldEvent = this.calendarData.find((e) => e.date === event.date);
    if (oldEvent)
      this.calendarData.splice(this.calendarData.indexOf(oldEvent), 1);
    this.calendarData.push(event);
    this.saveToLocalStorage();
    this.newDataSubject.next();
  }

  deleteEvent(event: CalendarEvent) {
    let index = this.calendarData.findIndex(
      (ev) =>
        ev.date.toLocaleDateString() ===
        (event?.date.toLocaleDateString() || '')
    );
    if (index !== -1) this.calendarData.splice(index, 1);
    else console.error('Event not found', event);
    this.saveToLocalStorage();
    this.newDataSubject.next();
  }

  searchByString(str: string){

    return this.calendarData.filter(
      (event) =>
        event.title.toLowerCase().includes(str.toLowerCase()) ||
        event.names.toLowerCase().includes(str.toLowerCase()) ||
        event.userDate.toLowerCase().includes(str.toLowerCase()) ||
        event.description.toLowerCase().includes(str.toLowerCase()) ||
        event.date.toLocaleDateString() === getDateFromString(str).toLocaleDateString()
    ).slice(0, 10)

  }

  getEvents(dateStart: Date, dateEnd: Date) {
    this.loadFromLocalStorage();
    return this.calendarData.filter(
      (event) => event.date >= dateStart && event.date <= dateEnd
    );
  }
}
