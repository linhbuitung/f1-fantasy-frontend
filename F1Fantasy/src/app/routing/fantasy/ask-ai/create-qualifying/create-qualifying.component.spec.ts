import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQualifyingComponent } from './create-qualifying.component';

describe('CreateQualifyingComponent', () => {
  let component: CreateQualifyingComponent;
  let fixture: ComponentFixture<CreateQualifyingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQualifyingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQualifyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
