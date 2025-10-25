import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickableItemsManagerComponent } from './pickable-items-manager.component';

describe('PickableItemsManagerComponent', () => {
  let component: PickableItemsManagerComponent;
  let fixture: ComponentFixture<PickableItemsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickableItemsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickableItemsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
