import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorStatisticComponent } from './constructor-statistic.component';

describe('ConstructorStatisticComponent', () => {
  let component: ConstructorStatisticComponent;
  let fixture: ComponentFixture<ConstructorStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructorStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructorStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
