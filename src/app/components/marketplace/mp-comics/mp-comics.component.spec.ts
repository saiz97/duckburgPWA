import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpComicsComponent } from './mp-comics.component';

describe('MpComicsComponent', () => {
  let component: MpComicsComponent;
  let fixture: ComponentFixture<MpComicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpComicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpComicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
