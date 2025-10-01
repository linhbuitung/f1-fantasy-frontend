import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueCreateComponent } from './league-create.component';

describe('LeagueCreateComponent', () => {
  let component: LeagueCreateComponent;
  let fixture: ComponentFixture<LeagueCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeagueCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
