import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguesLandingPageComponent } from './leagues-landing-page.component';

describe('LeaguesLandingPageComponent', () => {
  let component: LeaguesLandingPageComponent;
  let fixture: ComponentFixture<LeaguesLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaguesLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaguesLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
