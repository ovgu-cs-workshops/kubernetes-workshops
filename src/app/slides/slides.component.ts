import { Component, QueryList, ViewChildren, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ChapterComponent } from '../chapter/chapter.component';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss']
})
export class SlidesComponent implements AfterViewInit {
  @ViewChildren(ChapterComponent) private _chapters: QueryList<ChapterComponent>;

  public interactionLink: Promise<string>;
  private chapter = 0;

  constructor(private _changeDetector: ChangeDetectorRef, private config: ConfigService) {
    this.interactionLink = this.config.config.then(cfg => cfg.interactionLink);
  }

  public ngAfterViewInit(): void {
    const arr = this._chapters.toArray();
    let position = 0;
    for (let pos = 0; pos < this._chapters.length; pos++) {
      arr[pos].chapterSubject.next(this.chapter++);
      arr[pos].change();
      if (arr[pos - 1]) {
        arr[pos].prevOrder = arr[pos - 1].prevOrder + arr[pos - 1].order;
        arr[pos].prevOrderSubject.next(arr[pos].prevOrder);
      } else {
        arr[pos].prevOrder = 0;
        arr[pos].prevOrderSubject.next(arr[pos].prevOrder);
      }

      position = arr[pos].assignSlidePositions(position);
    }

    this._chapters.forEach(chap => {
      chap.setSlideCount(position);
    });

    this._changeDetector.detectChanges();
  }
}
