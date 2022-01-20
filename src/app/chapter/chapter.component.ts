import {Component, QueryList, ContentChildren, AfterViewInit, ChangeDetectorRef, ViewChildren, Input} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SlideComponent } from '../slide/slide.component';

@Component({
  selector: 'chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements AfterViewInit {
  @ContentChildren(SlideComponent) private _slides: QueryList<SlideComponent>;
  @ViewChildren(SlideComponent) private _slidesDirect: QueryList<SlideComponent>;

  @Input() public title = '';
  @Input() public subtitle = '';

  public order = 0;
  public prevOrder = 0;
  public prevOrderSubject = new BehaviorSubject<number>(0);
  public chapter = 0;
  public chapterSubject = new BehaviorSubject<number>(0);

  constructor(private changeDetector: ChangeDetectorRef) {
    this.chapterSubject.subscribe(v => {
      this.chapter = v;
    });
    this.prevOrderSubject.subscribe(v => {
      this.prevOrder = v;
    });
  }

  public change(): void {
    this.changeDetector.detectChanges();
  }

  public assignSlidePositions(start: number): number {
    this._slidesDirect.forEach(slide => {
      slide.position.next(++start);
    });

    this._slides.forEach(slide => {
      slide.position.next(++start);
    });

    return start;
  }

  public setSlideCount(count: number): void {
    this._slidesDirect.forEach(slide => {
      slide.slideCount.next(count);
    });

    this._slides.forEach(slide => {
      slide.slideCount.next(count);
    });
  }

  public ngAfterViewInit(): void {
    this._slidesDirect.forEach((slide) => {
      slide.subscribe(this.prevOrderSubject, this.chapterSubject);
      slide.order = this.order++;
    });
    this._slides.forEach((slide) => {
      slide.subscribe(this.prevOrderSubject, this.chapterSubject);
      slide.order = this.order++;
    });
    this.order--;
  }
}
