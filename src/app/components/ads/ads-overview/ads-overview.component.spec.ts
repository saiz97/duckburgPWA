import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsOverviewComponent } from './ads-overview.component';

describe('AdsOverviewComponent', () => {
  let component: AdsOverviewComponent;
  let fixture: ComponentFixture<AdsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
