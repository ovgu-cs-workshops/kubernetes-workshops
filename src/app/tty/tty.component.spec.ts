import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtyComponent } from './tty.component';

describe('TtyComponent', () => {
  let component: TtyComponent;
  let fixture: ComponentFixture<TtyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
