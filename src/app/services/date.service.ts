import { Injectable } from '@angular/core';
import { config } from '../../environments/config';

@Injectable()
export class DateService {

  constructor() { }

  public getDate(): string {
    return config.date;
  }
}
