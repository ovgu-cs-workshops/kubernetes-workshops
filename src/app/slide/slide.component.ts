import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DateService } from '../services/date.service';


@Component({
  selector: 'slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent {
  @Input() public scale = 1;
  @Input() public title: string;
  @Input() public titleLarge = false;
  public order: number;
  public totalOrder: number;
  public orderSubject = new BehaviorSubject<number>(0);
  public chapter: number;
  public position = new BehaviorSubject<number>(0);
  public slideCount = new BehaviorSubject<number>(0);

  constructor(private _dateService: DateService) { }

  public subscribe(subOrder, subChapter: BehaviorSubject<number>): void {
    subChapter.subscribe( c => {
      this.chapter = c;
      subOrder.subscribe( o => {
        this.totalOrder = o + this.order;
      });
    });
  }

  public getDate(): string {
    return this._dateService.getDate();
  }
}
