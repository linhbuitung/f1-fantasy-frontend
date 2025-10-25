import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerupImgManagerComponent } from './powerup-img-manager.component';

describe('PowerupImgManagerComponent', () => {
  let component: PowerupImgManagerComponent;
  let fixture: ComponentFixture<PowerupImgManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerupImgManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerupImgManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
