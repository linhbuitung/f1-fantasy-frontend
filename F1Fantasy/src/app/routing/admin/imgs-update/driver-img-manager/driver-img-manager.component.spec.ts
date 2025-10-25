import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverImgManagerComponent } from './driver-img-manager.component';

describe('DriverImgManagerComponent', () => {
  let component: DriverImgManagerComponent;
  let fixture: ComponentFixture<DriverImgManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverImgManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverImgManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
