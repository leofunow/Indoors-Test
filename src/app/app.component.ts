import { Component } from '@angular/core';
import { CalendarDataService } from './services/calendar-data.service';
import getDateFromString from './utils/RussianDate';
import { CalendarEvent } from './models/calendar-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  createQuery = '';

  isAddEventPopoverOpen = false;
  isSuccessMessageOpen = false;
  isErrorMessageOpen = false;

  selectedDate: Date = new Date();

  searchData: CalendarEvent[] = []

  constructor(private dataService: CalendarDataService) {}

  addEvent() {
    try {
      let parts = this.createQuery.split(',').map((x) => x.trim());
      let title = parts.pop();
      let date = getDateFromString(parts.join(','));
      this.dataService.addEvent({
        title: title,
        date: date,
        userDate: parts.join(','),
        names: '',
        description: '',
      });
      this.isSuccessMessageOpen = true;
      this.isErrorMessageOpen = false;
    } catch (error) {
      console.error(error);
      this.isErrorMessageOpen = true;
    }
  }

  selectEvent(item: Date){
    this.selectedDate = item;
  }


  reloadPage() {
    location.reload();
  }

  findEvent(str: string) {
    this.searchData = this.dataService.searchByString(str)
    // console.log(event);
  }
}
