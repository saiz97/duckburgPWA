import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpClothesComponent } from './mp-clothes.component';

describe('MpClothesComponent', () => {
  let component: MpClothesComponent;
  let fixture: ComponentFixture<MpClothesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpClothesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpClothesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
