import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMainRaceComponent } from './create-main-race.component';

describe('CreateMainRaceComponent', () => {
  let component: CreateMainRaceComponent;
  let fixture: ComponentFixture<CreateMainRaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMainRaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMainRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
