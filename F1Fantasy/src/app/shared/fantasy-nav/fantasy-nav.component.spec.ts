import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FantasyNavComponent } from './fantasy-nav.component';

describe('FantasyNavComponent', () => {
  let component: FantasyNavComponent;
  let fixture: ComponentFixture<FantasyNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FantasyNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FantasyNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
