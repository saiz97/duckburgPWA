import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpFiguresComponent } from './mp-figures.component';

describe('MpFiguresComponent', () => {
  let component: MpFiguresComponent;
  let fixture: ComponentFixture<MpFiguresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpFiguresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpFiguresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
