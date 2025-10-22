import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverStatisticComponent } from './driver-statistic.component';

describe('DriverStatisticComponent', () => {
  let component: DriverStatisticComponent;
  let fixture: ComponentFixture<DriverStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
