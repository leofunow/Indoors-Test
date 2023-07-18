import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CalendarCell } from 'src/app/models/calendar-cell';
import { CalendarDataService } from 'src/app/services/calendar-data.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnDestroy {

  date?: Date;

  @ViewChild('title')
  titleRef?: ElementRef;

  dateCells: CalendarCell[] = [];

  selectedCellId: number = -1;
  dataSub?: Subscription;

  eventFormGroup = new FormGroup({
    title: new FormControl(''),
    date: new FormControl(''),
    names: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(private dataService: CalendarDataService) {
    this.date =
      this.date ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.drawDateCells();
    this.dataSub = dataService.newDataSubject.subscribe(() => this.drawDateCells());
  }
  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }

  @Input("date")
  set Date(date: Date) {
    this.date = date;
    this.closePopover();
    this.drawDateCells();
  }

  drawDateCells() {
    this.dateCells = [];
    let nRow = 0;
    do {
      for (let i = 0; i < 7; i++) {
        let firstCellDate = this.getFirstCellDate(this.date);
        let day = firstCellDate.setDate(firstCellDate.getDate() + i + nRow * 7);
        this.dateCells.push({
          date: new Date(day),
        });
      }
      nRow++;
    } while (
      this.date.getMonth() ===
      this.dateCells[this.dateCells.length - 1].date.getMonth()
    );
    this.drawCellEvents();
  }

  drawCellEvents() {
    this.dateCells.map((cell) => (cell.event = undefined));
    this.dataService
      .getEvents(
        this.dateCells[0].date,
        this.dateCells[this.dateCells.length - 1].date
      )
      .forEach(
        (event) =>
          (this.dateCells.find(
            (cell) =>
              cell.date.toLocaleDateString() === event.date.toLocaleDateString()
          ).event = event)
      );
  }

  getCellClassList(cell: CalendarCell, id: number) {
    return {
      'calendar-main__cell': true,
      'calendar-main__cell_has-event': cell.event,
      'calendar-main__cell_selected': id === this.selectedCellId,
    };
  }

  getFirstCellDate(date: Date) {
    let startMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let day = startMonth.getDay();
    let diff = startMonth.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(startMonth.setDate(diff));
  }

  getLastCellDate(date: Date) {
    let endMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let day = endMonth.getDay();
    let diff = endMonth.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(endMonth.setDate(diff));
  }

  selectCell(i: number) {
    this.eventFormGroup.setValue({
      title: this.dateCells[i].event?.title ?? '',
      date: this.dateCells[i].event?.userDate ?? '',
      names: this.dateCells[i].event?.names ?? '',
      description: this.dateCells[i].event?.description ?? '',
    });
    this.selectedCellId = i === this.selectedCellId ? -1 : i;
    setTimeout(() => {
      this.titleRef?.nativeElement.focus();
    });
  }

  closePopover() {
    setTimeout(() => (this.selectedCellId = -1));
  }

  focusNext(event: any) {
    event.srcElement.nextElementSibling.focus()
  }

  getDay(i: number): string {
    return (
      [
        'Понедельник, ',
        'Вторник, ',
        'Среда, ',
        'Четверг, ',
        'Пятница, ',
        'Суббота, ',
        'Воскресенье, ',
      ][i] ?? ''
    );
  }

  getMonthString() {
    let monthString = this.date.toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric',
    });
    monthString = monthString.charAt(0).toUpperCase() + monthString.slice(1);
    monthString = monthString.slice(0, -3);
    return monthString;
  }

  submitEvent() {
    this.dataService.addEvent({
      ...this.eventFormGroup.value,
      date: this.dateCells[this.selectedCellId].date,
      userDate: this.eventFormGroup.value.date,
    });

    this.drawCellEvents();
    this.closePopover();
  }

  deleteEvent() {
    this.dataService.deleteEvent(this.dateCells[this.selectedCellId].event);
    this.drawCellEvents();
    this.closePopover();
  }

  toLastMonth() {
    this.Date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
    this.closePopover();
  }

  toNextMonth() {
    this.Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
    this.closePopover();
  }

  toToday() {
    this.Date = new Date();
    this.closePopover();
  }
}
