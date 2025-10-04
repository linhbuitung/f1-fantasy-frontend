import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LeagueService } from '../../../../core/services/leagues/league.service';
import { LeagueGetDto } from '../../../../core/services/leagues/dtos/league.get.dto';
import { UserInLeagueDto } from '../../../../core/services/leagues/dtos/user-in-league.get.dto';
import { JoinRequestGetDto } from '../../../../core/services/leagues/dtos/join-request.get.dto';
import { ContentContainerComponent } from '../../../../shared/content-container/content-container.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-league-view',
  standalone: true,
  imports: [CommonModule, ContentContainerComponent, RouterLink],
  templateUrl: './league-view.component.html',
  styleUrl: './league-view.component.scss'
})
export class LeagueViewComponent implements OnInit {
  league: LeagueGetDto | null = null;
  leaguePlayers: UserInLeagueDto[] = [];
  playersTotal = 0;
  playersPageNum = 1;
  playersPageSize = environment.PAGE_SIZE;
  loadingPlayers = false;
  currentUserId: number | null = null;
  isOwner = false;
  hasRequested = false;
  hasJoined = false;
  joinRequest: JoinRequestGetDto | null = null;
  joinSubmitting = false;
  joinSuccess: string | null = null;
  joinError: string | null = null;
  leagueId: number = 0;
  leaveSubmitting = false;
  leaveSuccess: string | null = null;
  leaveError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
      this.leagueId = Number(this.route.snapshot.paramMap.get('leagueId'));
      this.loadLeague();
    });
  }

  loadLeague(pageNum: number = 1) {
    this.loadingPlayers = true;
    this.leagueService.getLeagueWithPlayersByIdPaged(this.leagueId, pageNum, this.playersPageSize).subscribe({
      next: (league: LeagueGetDto) => {
        this.league = league;
        this.leaguePlayers = league.users || [];
        this.playersTotal = league.totalPlayersNum ?? 0; // Adjust if backend returns total count
        this.isOwner = this.currentUserId === league.owner.id;
        this.hasJoined = !!league.users?.find(u => u.id === this.currentUserId);
        this.checkJoinRequest();
        this.loadingPlayers = false;
      },
      error: () => {
        this.leaguePlayers = [];
        this.loadingPlayers = false;
      }
    });
  }

  checkJoinRequest() {
    if (!this.currentUserId || !this.league) return;
    this.leagueService.getJoinRequestForUserInLeague(this.currentUserId, this.league.id).subscribe({
      next: (req) => {
        this.joinRequest = req;
        this.hasRequested = !!req && !req.isAccepted;
      },
      error: () => { this.joinRequest = null; }
    });
  }

  onPlayersPageChange(page: number) {
    this.playersPageNum = page;
    this.loadLeague(page);
  }

  onJoinLeague() {
    if (!this.league || !this.currentUserId) return;
    this.joinSubmitting = true;
    this.joinError = null;
    this.leagueService.joinLeague(this.currentUserId, this.league.id).subscribe({
      next: () => {
        this.joinSuccess = 'Join request sent!';
        this.hasRequested = true;
        this.joinSubmitting = false;
      },
      error: (err) => {
        this.joinError = err?.error?.message || 'Failed to send join request.';
        this.joinSubmitting = false;
      }
    });
  }

  onLeaveLeague() {
    if (!this.league || !this.currentUserId) return;
    this.leaveSubmitting = true;
    this.leaveError = null;
    this.leagueService.leaveLeague(this.currentUserId, this.league.id).subscribe({
      next: () => {
        this.leaveSuccess = 'You have left the league.';
        this.hasJoined = false;
        this.leaveSubmitting = false;
        // Refresh league data
        this.loadLeague();
      },
      error: (err) => {
        this.leaveError = err?.error?.message || 'Failed to leave league.';
        this.leaveSubmitting = false;
      }
    });
  }
}
