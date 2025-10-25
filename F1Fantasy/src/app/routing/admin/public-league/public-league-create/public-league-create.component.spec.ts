import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLeagueCreateComponent } from './public-league-create.component';

describe('PublicLeagueCreateComponent', () => {
  let component: PublicLeagueCreateComponent;
  let fixture: ComponentFixture<PublicLeagueCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLeagueCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicLeagueCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
