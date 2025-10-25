import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../../shared/confirm-modal/confirm-modal.component';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { SeasonGetDto } from '../../../../core/services/admin/dtos/season.get.dto';
import { UserGetDto } from '../../../../core/services/user/dtos/user.get.dto';

@Component({
  selector: 'app-season-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './season-manager.component.html',
  styleUrl: './season-manager.component.scss'
})
export class SeasonManagerComponent implements OnInit {
  currentUser: UserGetDto | null = null;
  activeSeason: SeasonGetDto | null = null;
  loading = false;
  serverError: string | null = null;
  successMessage: string | null = null;

  // confirm modal state
  showStartConfirm = false;
  showDeactivateConfirm = false;

  // default year for starting a season
  startYear = new Date().getFullYear();

  constructor(private adminService: AdminService, private authService: AuthService) {}

  ngOnInit(): void {
        this.authService.userProfile$.subscribe(u => {
            this.currentUser = u ?? null;
          });
        // always attempt to load active season for UI
          this.loadActiveSeason();
      }

  get isSuperAdmin(): boolean {
        return !!(this.currentUser?.roles && this.currentUser.roles.includes('SuperAdmin'));
      }

  loadActiveSeason(): void {
        this.loading = true;
        this.serverError = null;
        this.adminService.GetActiveSeason().subscribe({
            next: (s) => {
              this.activeSeason = s;
              this.loading = false;
            },
            error: (err) => {
              // 404 means no active season
                if (err?.status === 404) {
                  this.activeSeason = null;
                } else {
                  this.serverError = err?.error?.message || 'Failed to load active season.';
                }
              this.loading = false;
            }
        });
      }

  confirmStart(): void {
        this.serverError = null;
        this.successMessage = null;
        if (!this.isSuperAdmin) {
            this.serverError = 'Insufficient permissions.';
            return;
          }
        this.showStartConfirm = true;
      }

  onConfirmStart(): void {
        this.showStartConfirm = false;
        this.serverError = null;
        this.successMessage = null;
        this.loading = true;
        this.adminService.StartNewSeason(Number(this.startYear)).subscribe({
            next: (s) => {
              this.activeSeason = s;
              this.successMessage = `Season ${s.year} started.`;
              this.loading = false;
            },
            error: (err) => {
              this.serverError = err?.error?.message || 'Failed to start season.';
              this.loading = false;
            }
        });
      }

  confirmDeactivate(): void {
        this.serverError = null;
        this.successMessage = null;
        if (!this.isSuperAdmin) {
            this.serverError = 'Insufficient permissions.';
            return;
          }
        if (!this.activeSeason) {
            this.serverError = 'No active season to deactivate.';
            return;
          }
        this.showDeactivateConfirm = true;
      }

  onConfirmDeactivate(): void {
        this.showDeactivateConfirm = false;
        this.serverError = null;
        this.successMessage = null;
        this.loading = true;
        this.adminService.DeactivateActiveSeason().subscribe({
            next: () => {
              this.activeSeason = null;
              this.successMessage = 'Active season deactivated.';
              this.loading = false;
            },
            error: (err) => {
              this.serverError = err?.error?.message || 'Failed to deactivate season.';
              this.loading = false;
            }
        });
      }
}
