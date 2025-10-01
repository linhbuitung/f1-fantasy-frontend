import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { LeagueService } from '../../../../core/services/leagues/league.service';
import { LeagueGetDto } from '../../../../core/services/leagues/dtos/league.get.dto';
import { JoinRequestGetDto } from '../../../../core/services/leagues/dtos/join-request.get.dto';
import { LeagueUpdateDto } from '../../../../core/services/leagues/dtos/league.update.dto';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContentContainerComponent } from '../../../../shared/content-container/content-container.component';
import { CommonModule } from '@angular/common';
import {ConfirmModalComponent} from '../../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-league-manage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ContentContainerComponent, RouterLink, ConfirmModalComponent],
  templateUrl: './league-manage.component.html',
  styleUrl: './league-manage.component.scss'
})
export class LeagueManageComponent implements OnInit {
  league: LeagueGetDto | null = null;
  joinRequests: JoinRequestGetDto[] = [];
  updateForm: FormGroup;
  submitting = false;
  serverError: string | null = null;
  successMessage: string | null = null;
  leagueId: number = 0;
  ownerId: number = 0;
  showDeleteConfirm = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.leagueId = Number(this.route.snapshot.paramMap.get('leagueId'));
    this.loadLeague();
  }

  loadLeague() {
    this.leagueService.getLeagueWithPlayersById(this.leagueId).subscribe(league => {
      this.league = league;
      this.ownerId = league.owner.id;
      this.updateForm.patchValue({
        name: league.name,
        description: league.description ?? '',
      });
      this.loadJoinRequests();
    });
  }

  loadJoinRequests() {
    if (!this.ownerId) return;
    this.leagueService.getJoinRequestsByLeagueIdAndOwnerId(this.leagueId, this.ownerId).subscribe(requests => {
      this.joinRequests = requests;
    });
  }

  onDeleteLeague() {
    if (!this.league || !this.ownerId) return;
    this.deleting = true;
    this.leagueService.DeletePrivateLeague(this.ownerId, this.league.id).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/fantasy/leagues']);
      },
      error: () => {
        this.deleting = false;
        this.showDeleteConfirm = false;
        this.serverError = 'Failed to delete league. Please try again.';
      }
    });
  }

  onUpdate() {
    if (!this.league || this.updateForm.invalid) return;
    this.submitting = true;
    this.serverError = null;
    this.successMessage = null;
    const dto: LeagueUpdateDto = {
      id: this.league.id,
      name: this.updateForm.value.name,
      description: this.updateForm.value.description,
      ownerId: this.ownerId
    };
    this.leagueService.updatePrivateLeague(this.ownerId, dto).subscribe({
      next: (updated) => {
        this.successMessage = 'League updated!';
        this.league = { ...this.league!, ...updated };
        this.submitting = false;
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to update league.';
        this.submitting = false;
      }
    });
  }

  handleJoinRequest(request: JoinRequestGetDto, isAccepted: boolean) {
    this.leagueService.handleJoinRequest(this.ownerId, this.leagueId, {
      leagueId: this.leagueId,
      userId: request.userId,
      isAccepted
    }).subscribe({
      next: () => {
        this.loadJoinRequests();
      }
    });
  }
}
