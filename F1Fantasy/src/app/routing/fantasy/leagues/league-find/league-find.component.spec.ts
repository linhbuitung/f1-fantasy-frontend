import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueFindComponent } from './league-find.component';

describe('LeagueFindComponent', () => {
  let component: LeagueFindComponent;
  let fixture: ComponentFixture<LeagueFindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueFindComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeagueFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
