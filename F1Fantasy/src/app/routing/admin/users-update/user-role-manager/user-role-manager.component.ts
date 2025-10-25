import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmModalComponent } from '../../../../shared/confirm-modal/confirm-modal.component';
import { UserService } from '../../../../core/services/user/user.service';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { UserGetDto, Role } from '../../../../core/services/user/dtos/user.get.dto';
import { ApplicationUserForAdminUpdateDto } from '../../../../core/services/admin/dtos/user-admin.update.dto';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-role-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './user-role-manager.component.html',
  styleUrl: './user-role-manager.component.scss'
})
export class UserRoleManagerComponent {
  searchForm: FormGroup;
  users: UserGetDto[] = [];
  selectedUser: UserGetDto | null = null;

  // local role toggles
  rolesState: Record<Role, boolean> = { Player: true, Admin: false, SuperAdmin: false };

  loading = false;
  searching = false;
  saving = false;
  serverError: string | null = null;
  successMessage: string | null = null;

  // confirm modal
  showSaveConfirm = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private adminService: AdminService
  ) {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSearch() {
    if (this.searchForm.invalid) return;
    const q = String(this.searchForm.value.query).trim();
    if (!q || q.length < 2) return;
    this.searching = true;
    this.serverError = null;
    this.userService.SearchUsers(q)
      .pipe(finalize(() => (this.searching = false)))
      .subscribe({
        next: result => {
          this.users = result.items || [];
        },
        error: (err) => {
          this.users = [];
          this.serverError = err?.error?.message || 'Search failed';
        }
      });
  }

  selectUser(u: UserGetDto) {
    this.selectedUser = u;
    this.serverError = null;
    this.successMessage = null;
    // initialize local role toggles from returned roles (ensure Player default)
    this.rolesState = { Player: true, Admin: false, SuperAdmin: false };
    (u.roles || []).forEach(r => { (this.rolesState as any)[r] = true; });
  }

  get selectedIsSuperAdmin(): boolean {
    return !!this.selectedUser?.roles?.includes('SuperAdmin');
  }

  // prevent removing Player role — always true in payload
  toggleRole(role: Role) {
    if (!this.selectedUser) return;
    if (role === 'Player') return; // always present
    if (this.selectedIsSuperAdmin) return; // block modifications when target is SuperAdmin
    this.rolesState[role] = !this.rolesState[role];
  }

  confirmSave() {
    if (!this.selectedUser) {
      this.serverError = 'Select a user first.';
      return;
    }
    if (this.selectedIsSuperAdmin) {
      this.serverError = 'Cannot update roles for SuperAdmin.';
      return;
    }
    this.serverError = null;
    this.successMessage = null;
    this.showSaveConfirm = true;
  }

  save() {
    if (!this.selectedUser) return;
    this.showSaveConfirm = false;
    this.saving = true;
    this.serverError = null;

    // Build roles ensuring Player present
    const roles = Object.entries(this.rolesState)
      .filter(([_, v]) => v)
      .map(([k]) => k as Role);
    if (!roles.includes('Player')) roles.push('Player');

    const dto: ApplicationUserForAdminUpdateDto = { roles };

    this.adminService.updateUserRoles(this.selectedUser.id, dto)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (updated) => {
          // reflect updated roles in UI
          this.selectedUser = { ...this.selectedUser!, roles: updated.roles };
          this.rolesState = { Player: true, Admin: false, SuperAdmin: false };
          (updated.roles || []).forEach(r => { (this.rolesState as any)[r] = true; });
          this.successMessage = 'User roles updated.';
        },
        error: (err) => {
          this.serverError = err?.error?.message || 'Failed to update roles.';
        }
      });
  }
}
