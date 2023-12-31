import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @ViewChild('container')
  ref: ElementRef;

  @Input()
  closable = true;

  @Input()
  align?: 'left' | 'right' | 'top' | 'bottom';

  @Output()
  onClose = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.align) 
      setTimeout(() => this.ref.nativeElement.classList.add(this.align))
    else
      setTimeout(() => {
        let w = window.innerWidth;
        let h = window.innerHeight;
        let x = this.ref.nativeElement.getBoundingClientRect().x;
        let y = this.ref.nativeElement.getBoundingClientRect().y;

        let right = w - x;
        let bottom = h - y;
        let left = w - right;
        let top = h - bottom;

        let minValue = Math.min(right, left, top, bottom);

        switch (minValue) {
          case left:
            this.ref.nativeElement.classList.add('right');
            break;
          case right:
            this.ref.nativeElement.classList.add('left');
            break;
          case top:
            this.ref.nativeElement.classList.add('bottom');
            break;
          case bottom:
            this.ref.nativeElement.classList.add('top');
            break;
        }
      });
  }

  close() {
    this.onClose.emit();
  }

  popoverClick(event: Event) {
    event.stopImmediatePropagation();
  }

  getClassList() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let x = this.ref.nativeElement.getBoundingClientRect().x;
    let y = this.ref.nativeElement.getBoundingClientRect().y;

    let right = w - x;
    let bottom = h - y;
    let left = w - right;
    let top = h - bottom;

    let maxValue = Math.max(right, left, top, bottom);
    console.log(this.ref.nativeElement.getBoundingClientRect().x);

    return {
      'popover-container': true,
      left: maxValue === left,
      right: maxValue === right,
      top: maxValue === top,
      bottom: maxValue === bottom,
    };
  }
}
