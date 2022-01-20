import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SlidesComponent } from './slides/slides.component';
import { SlideComponent } from './slide/slide.component';
import { ChapterComponent } from './chapter/chapter.component';

import { DateService } from './services/date.service';
import { BackendService } from './services/backend.service';
import { TtyComponent } from './tty/tty.component';

@NgModule({
  declarations: [
    AppComponent,
    SlidesComponent,
    SlideComponent,
    ChapterComponent,
    TtyComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    DateService,
    BackendService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
