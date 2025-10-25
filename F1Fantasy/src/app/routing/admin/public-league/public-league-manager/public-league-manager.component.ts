import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeagueService } from '../../../../core/services/leagues/league.service';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LeagueGetDto } from '../../../../core/services/leagues/dtos/league.get.dto';
import { LeagueSearchResultDto } from '../../../../core/services/leagues/dtos/league-search-result.dto';
import { LeagueUpdateDto } from '../../../../core/services/leagues/dtos/league.update.dto';
import { environment } from '../../../../../environments/environment';
import {ConfirmModalComponent} from '../../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-public-league-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './public-league-manager.component.html',
  styleUrl: './public-league-manager.component.scss'
})
export class PublicLeagueManagerComponent implements OnInit {
  searchForm: FormGroup;
  editForm: FormGroup;
  showDeleteConfirm = false;

  results: LeagueGetDto[] = [];
  selectedLeague: LeagueGetDto | null = null;

  pageNum = 1;
  pageSize = environment.PAGE_SIZE || 10;
  total = 0;
  loading = false;

  submitting = false;
  deleting = false;
  serverError: string | null = null;
  successMessage: string | null = null;

  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private adminService: AdminService,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({ query: [''] });
    this.editForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(500)]],
      maxPlayersNum: [10, [Validators.required, Validators.min(2), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.authService.userProfile$.subscribe(u => this.currentUserId = u?.id ?? null);
    // initial load
    this.onSearch();
  }

  onSearch(page: number = 1) {
    this.pageNum = page;
    this.loading = true;
    this.serverError = null;
    this.leagueService.SearchPublicLeagues(this.searchForm.value.query, this.pageNum, this.pageSize).subscribe({
      next: (res: LeagueSearchResultDto) => {
        this.results = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.serverError = 'Failed to search public leagues.';
        this.loading = false;
      }
    });
  }

  select(league: LeagueGetDto | null) {
    this.selectedLeague = league;
    this.successMessage = null;
    this.serverError = null;
    if (league) {
      this.editForm.patchValue({
        id: league.id,
        name: league.name,
        description: league.description ?? '',
        maxPlayersNum: league.maxPlayersNum
      });
    } else {
      this.editForm.reset({ id: 0, name: '', description: '', maxPlayersNum: 10 });
    }
  }

  onUpdate() {
    if (!this.currentUserId) { this.serverError = 'No current user.'; return; }
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const dto: LeagueUpdateDto = {
      id: Number(this.editForm.value.id),
      name: String(this.editForm.value.name).trim(),
      description: String(this.editForm.value.description || '').trim(),
      ownerId: this.currentUserId
    };
    this.submitting = true;
    this.serverError = null;
    this.adminService.updatePublicLeague(this.currentUserId, dto).subscribe({
      next: (updated) => {
        this.successMessage = 'Public league updated.';
        this.submitting = false;
        // update local list
        this.results = this.results.map(r => r.id === updated.id ? updated : r);
        this.select(updated);
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to update league.';
        this.submitting = false;
      }
    });
  }

  onDeleteLeague() {
    if (!this.selectedLeague || !this.currentUserId) return;
    this.deleting = true;
    this.serverError = null;
    this.adminService.DeleteLeague(this.currentUserId, this.selectedLeague.id).subscribe({
      next: () => {
        this.successMessage = 'Public league deleted.';
        this.deleting = false;
        // remove from local list and clear selection
        this.results = this.results.filter(r => r.id !== this.selectedLeague!.id);
        this.select(null);
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to delete league.';
        this.deleting = false;
      },
    });
    this.showDeleteConfirm = false;
  }

  onPageChange(page: number) {
    if (page < 1) return;
    this.onSearch(page);
  }

  protected readonly Math = Math;
}
