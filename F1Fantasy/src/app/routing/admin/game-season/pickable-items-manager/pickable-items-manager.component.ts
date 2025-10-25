import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmModalComponent } from '../../../../shared/confirm-modal/confirm-modal.component';
import { PickableItemsService } from '../../../../core/services/static-data/pickable-items.service';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { DriverService } from '../../../../core/services/static-data/driver.service';
import { ConstructorService } from '../../../../core/services/static-data/constructor.service';
import { DriverGetDto } from '../../../../core/services/static-data/dtos/driver.get.dto';
import { ConstructorGetDto } from '../../../../core/services/static-data/dtos/constructor.get.dto';
import { PickableItemGetDto } from '../../../../core/services/static-data/dtos/pickable-items.get.dto';
import { PickableItemUpdateDto } from '../../../../core/services/admin/dtos/pickable-item.update.dto';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pickable-items-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './pickable-items-manager.component.html',
  styleUrl: './pickable-items-manager.component.scss'
})
export class PickableItemsManagerComponent implements OnInit {
  // forms for searching
  driverSearchForm: FormGroup;
  constructorSearchForm: FormGroup;

  // search results
  driverResults: DriverGetDto[] = [];
  constructorResults: ConstructorGetDto[] = [];

  // current pickable list (from server)
  pickable: PickableItemGetDto | null = null;

  // UI state
  loading = false;
  searchingDrivers = false;
  searchingConstructors = false;
  saving = false;
  serverError: string | null = null;
  successMessage: string | null = null;

  // confirm modal
  showSaveConfirm = false;

  // paging (optional)
  pageNum = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private pickableSvc: PickableItemsService,
    private adminSvc: AdminService,
    private driverSvc: DriverService,
    private constructorSvc: ConstructorService
  ) {
    this.driverSearchForm = this.fb.group({ query: ['', [Validators.minLength(2)]] });
    this.constructorSearchForm = this.fb.group({ query: ['', [Validators.minLength(2)]] });
  }

  ngOnInit(): void {
    this.loadPickableItems();
  }

  loadPickableItems(): void {
    this.loading = true;
    this.serverError = null;
    this.pickableSvc.getPickableItems()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (p) => {
          this.pickable = p;
        },
        error: (err) => {
          this.serverError = err?.error?.message || 'Failed to load pickable items';
        }
      });
  }

  // Driver search
  searchDrivers(page: number = 1): void {
    const q = (this.driverSearchForm.value.query || '').trim();
    if (!q || q.length < 2) {
      this.driverResults = [];
      return;
    }
    this.searchingDrivers = true;
    this.driverSvc.SearchDrivers(q, page, this.pageSize)
      .pipe(finalize(() => (this.searchingDrivers = false)))
      .subscribe({
        next: (res) => {
          this.driverResults = res.items || [];
        },
        error: () => {
          this.serverError = 'Driver search failed';
        }
      });
  }

  addDriverToPickable(d: DriverGetDto): void {
    if (!this.pickable) return;
    if (this.pickable.drivers.find(x => x.id === d.id)) return;
    this.pickable.drivers.push(d);
    this.successMessage = `${d.givenName} ${d.familyName} added to pickable drivers.`;
  }

  removeDriverFromPickable(id: number): void {
    if (!this.pickable) return;
    this.pickable.drivers = this.pickable.drivers.filter(d => d.id !== id);
  }

  // Constructor search
  searchConstructors(page: number = 1): void {
    const q = (this.constructorSearchForm.value.query || '').trim();
    if (!q || q.length < 2) {
      this.constructorResults = [];
      return;
    }
    this.searchingConstructors = true;
    this.constructorSvc.SearchConstructors(q, page, this.pageSize)
      .pipe(finalize(() => (this.searchingConstructors = false)))
      .subscribe({
        next: (res) => {
          this.constructorResults = res.items || [];
        },
        error: () => {
          this.serverError = 'Constructor search failed';
        }
      });
  }

  addConstructorToPickable(c: ConstructorGetDto): void {
    if (!this.pickable) return;
    if (this.pickable.constructors.find(x => x.id === c.id)) return;
    this.pickable.constructors.push(c);
    this.successMessage = `${c.name} added to pickable constructors.`;
  }

  removeConstructorFromPickable(id: number): void {
    if (!this.pickable) return;
    this.pickable.constructors = this.pickable.constructors.filter(c => c.id !== id);
  }

  confirmSave(): void {
    if (!this.pickable) {
      this.serverError = 'Nothing to save';
      return;
    }
    this.serverError = null;
    this.successMessage = null;
    this.showSaveConfirm = true;
  }

  save(): void {
    if (!this.pickable) return;
    this.showSaveConfirm = false;
    this.saving = true;
    const dto: PickableItemUpdateDto = {
      driverIds: (this.pickable.drivers || []).map(d => d.id),
      constructorIds: (this.pickable.constructors || []).map(c => c.id)
    };
    this.adminSvc.updatePickableItems(dto)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (updated) => {
          this.pickable = updated;
          this.successMessage = 'Pickable items updated.';
        },
        error: (err) => {
          this.serverError = err?.error?.message || 'Failed to update pickable items';
        }
      });
  }

  // helper checks
  isDriverPickable(id: number): boolean {
    return !!this.pickable?.drivers.find(d => d.id === id);
  }

  isConstructorPickable(id: number): boolean {
    return !!this.pickable?.constructors.find(c => c.id === id);
  }
}
