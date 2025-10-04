import {Component, OnInit} from '@angular/core';
import {LeagueService} from '../../../../core/services/leagues/league.service';
import {LeagueGetDto, LeagueType} from '../../../../core/services/leagues/dtos/league.get.dto';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {ContentContainerComponent} from '../../../../shared/content-container/content-container.component';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-leagues-landing-page',
  templateUrl: './leagues-landing-page.component.html',
  imports: [
    ContentContainerComponent,
    RouterLink,
    NgForOf
  ],
  styleUrl: './leagues-landing-page.component.scss'
})
export class LeaguesLandingPageComponent implements OnInit {
  ownedLeagues: LeagueGetDto[] = [];
  joinedLeagues: LeagueGetDto[] = [];
  currentUserId: number | null = null;

  constructor(
    private leagueService: LeagueService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
      if (this.currentUserId) {
        this.leagueService.getOwnedLeagues(this.currentUserId).subscribe(leagues => {
          this.ownedLeagues = leagues;
        });
        this.leagueService.getJoinedLeagues(this.currentUserId).subscribe(leagues => {
          this.joinedLeagues = leagues;
        });
      }
    });
  }
  get canCreateLeague(): boolean {
    return this.ownedLeagues.length < environment.MAX_OWNED_LEAGUES;
  }

  get canJoinLeague(): boolean {
    return this.joinedLeagues.length < environment.MAX_JOINED_LEAGUES;
  }
  get joinedPublicLeagues(): LeagueGetDto[] {
    return this.joinedLeagues.filter(l => l.type === LeagueType.Public);
  }

  get joinedPrivateLeagues(): LeagueGetDto[] {
    return this.joinedLeagues.filter(l => l.type === LeagueType.Private);
  }


  protected readonly LeagueType = LeagueType;
}
