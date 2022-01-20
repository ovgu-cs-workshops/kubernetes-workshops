import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class ConfigService {
  public config: Promise<any>;
  constructor() {
    this.config = fetch(`config.json?id=${Date.now()}`).then(r => r.json());
  }
}
