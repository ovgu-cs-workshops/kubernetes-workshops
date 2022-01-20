import { Component, AfterViewInit } from '@angular/core';

import 'impress.js';

declare var impress: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor() {
  }

  public ngAfterViewInit(): void {
    impress().init();
  }
}
