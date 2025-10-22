import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticContainerComponent } from './statistic-container.component';

describe('StatisticContainerComponent', () => {
  let component: StatisticContainerComponent;
  let fixture: ComponentFixture<StatisticContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
