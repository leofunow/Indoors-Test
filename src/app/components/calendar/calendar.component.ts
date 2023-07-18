import { Component, Input, OnInit } from '@angular/core';
import { CalendarCell } from 'src/app/models/calendar-cell';
import { CalendarDataService } from 'src/app/services/calendar-data.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input()
  date?: Date;

  dateCells: CalendarCell[] = [];

  selectedCellId: number = -1;

  constructor( private dataService: CalendarDataService) {
    this.date =
      this.date ??
      new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.drawDateCells();
  }

  set Date(date: Date) {
    this.date = date;
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
    this.selectedCellId = i;
  }

  getDay(i: number): string{
    return ([
      'Понедельник, ',
      'Вторник, ',
      'Среда, ',
      'Четверг, ',
      'Пятница, ',
      'Суббота, ',
      'Воскресенье, '
    ])[i] ?? ""
  }

  toLastMonth(){
    this.Date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
  }

  toNextMonth(){
    this.Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
  }

  toToday(){
    this.Date = new Date();
  }
}
