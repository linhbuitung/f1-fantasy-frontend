import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskAiLandingPageComponent } from './ask-ai-landing-page.component';

describe('AskAiLandingPageComponent', () => {
  let component: AskAiLandingPageComponent;
  let fixture: ComponentFixture<AskAiLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskAiLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskAiLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
