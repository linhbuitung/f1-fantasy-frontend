import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLeagueManagerComponent } from './public-league-manager.component';

describe('PublicLeagueManagerComponent', () => {
  let component: PublicLeagueManagerComponent;
  let fixture: ComponentFixture<PublicLeagueManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLeagueManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicLeagueManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
