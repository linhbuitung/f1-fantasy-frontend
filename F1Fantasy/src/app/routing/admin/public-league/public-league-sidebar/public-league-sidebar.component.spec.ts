import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLeagueSidebarComponent } from './public-league-sidebar.component';

describe('PublicLeagueSidebarComponent', () => {
  let component: PublicLeagueSidebarComponent;
  let fixture: ComponentFixture<PublicLeagueSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLeagueSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicLeagueSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
