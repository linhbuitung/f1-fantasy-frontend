import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSeasonSidebarComponent } from './game-season-sidebar.component';

describe('GameSeasonSidebarComponent', () => {
  let component: GameSeasonSidebarComponent;
  let fixture: ComponentFixture<GameSeasonSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSeasonSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSeasonSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
