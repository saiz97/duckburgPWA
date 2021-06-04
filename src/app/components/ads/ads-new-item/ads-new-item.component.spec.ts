import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsNewItemComponent } from './ads-new-item.component';

describe('AdsNewItemComponent', () => {
  let component: AdsNewItemComponent;
  let fixture: ComponentFixture<AdsNewItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsNewItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsNewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
