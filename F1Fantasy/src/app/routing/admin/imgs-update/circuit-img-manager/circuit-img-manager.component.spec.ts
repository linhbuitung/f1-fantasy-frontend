import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitImgManagerComponent } from './circuit-img-manager.component';

describe('CircuitImgManagerComponent', () => {
  let component: CircuitImgManagerComponent;
  let fixture: ComponentFixture<CircuitImgManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircuitImgManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircuitImgManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
