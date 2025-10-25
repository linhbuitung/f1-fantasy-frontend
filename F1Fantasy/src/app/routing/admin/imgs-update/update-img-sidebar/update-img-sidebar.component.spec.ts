import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateImgSidebarComponent } from './update-img-sidebar.component';

describe('UpdateImgSidebarComponent', () => {
  let component: UpdateImgSidebarComponent;
  let fixture: ComponentFixture<UpdateImgSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateImgSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateImgSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
