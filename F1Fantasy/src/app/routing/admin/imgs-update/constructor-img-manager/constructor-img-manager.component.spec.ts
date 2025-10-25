import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorImgManagerComponent } from './constructor-img-manager.component';

describe('ConstructorImgManagerComponent', () => {
  let component: ConstructorImgManagerComponent;
  let fixture: ComponentFixture<ConstructorImgManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructorImgManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructorImgManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
