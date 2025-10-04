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
import {UserInLeagueDto} from '../../../../core/services/leagues/dtos/user-in-league.get.dto';
import {environment} from '../../../../../environments/environment';
import {AuthService} from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-league-manage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ContentContainerComponent, RouterLink, ConfirmModalComponent],
  templateUrl: './league-manage.component.html',
  styleUrl: './league-manage.component.scss'
})
export class LeagueManageComponent implements OnInit {
  currentUserId: number | null = null;
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
  leaguePlayers: UserInLeagueDto[] = [];
  playersTotal = 0;
  playersPageNum = 1;
  playersPageSize = environment.PAGE_SIZE;
  loadingPlayers = false;

  constructor(
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.updateForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.authService.userProfile$.subscribe(user => {
      this.currentUserId = user?.id ?? null;});
    this.leagueId = Number(this.route.snapshot.paramMap.get('leagueId'));

    this.loadLeague();
  }

  loadLeague(pageNum: number = 1) {
    this.leagueService.getLeagueWithPlayersByIdPaged(this.leagueId, pageNum, this.playersPageSize).subscribe({
      next: (league: LeagueGetDto) => {
        this.league = league;
        this.ownerId = league.owner.id;
        this.updateForm.patchValue({
          name: league.name,
          description: league.description ?? '',
        });
        if(this.ownerId != this.currentUserId) {
          this.router.navigateByUrl('/fantasy/leagues');
          return;
        }
        this.leaguePlayers = league.users || [];
        this.playersTotal = league.users?.length ?? 0; // Adjust if backend returns total count
        this.loadingPlayers = false;

        this.loadJoinRequests();
      },
      error: () => {
        this.leaguePlayers = [];
        this.loadingPlayers = false;
      }
    });
  }

  loadLeaguePlayers(pageNum: number = 1) {
    this.loadingPlayers = true;
    this.leagueService.getLeagueWithPlayersByIdPaged(this.leagueId, pageNum, this.playersPageSize).subscribe({
      next: (league) => {
        this.leaguePlayers = league.users || [];
        this.playersTotal = league.users?.length ?? 0; // Adjust if backend returns total count
        this.loadingPlayers = false;
      },
      error: () => {
        this.leaguePlayers = [];
        this.loadingPlayers = false;
      }
    });
  }

  loadJoinRequests() {
    if (!this.ownerId && this.ownerId != this.currentUserId) return;
    this.leagueService.getJoinRequestsByLeagueIdAndOwnerId(this.leagueId, this.ownerId).subscribe(requests => {
      this.joinRequests = requests;
    });
  }


  onDeleteLeague() {
    if (!this.league || !this.ownerId || this.ownerId != this.currentUserId) return;
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
    if (!this.league || this.updateForm.invalid || this.ownerId != this.currentUserId) return;
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
    if (!this.ownerId || this.ownerId != this.currentUserId) return;
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



  onPlayersPageChange(page: number) {
    this.playersPageNum = page;
    this.loadLeaguePlayers(page);
  }

  onKickPlayer(user: UserInLeagueDto) {
    if (!this.league || this.ownerId != this.currentUserId) return;
    this.leagueService.kickUserFromLeague(this.currentUserId,this.league.id, user.id).subscribe({
      next: () => this.loadLeaguePlayers(this.playersPageNum)
    });
  }

}
