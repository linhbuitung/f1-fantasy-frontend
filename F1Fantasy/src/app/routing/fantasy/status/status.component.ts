import {Component, OnInit} from '@angular/core';
import {ContentContainerComponent} from '../../../shared/content-container/content-container.component';
import {GeneralSeasonStatisticDto} from '../../../core/services/statistic/dtos/general-season-statistic.get.dto';
import {StatisticService} from '../../../core/services/statistic/statistic.service';
import {DatePipe, NgFor, NgIf} from '@angular/common';
import {
  UserGeneralSeasonStatisticDto
} from '../../../core/services/statistic/dtos/user-general-season-statistic.get.dto';
import {AuthService} from '../../../core/services/auth/auth.service';
import {TeamOfTheRaceDto} from '../../../core/services/statistic/dtos/team-of-the-race.get.dto';
import { RaceGetDto } from '../../../core/services/statistic/dtos/race.get.dto';

@Component({
  selector: 'app-status',
  imports: [
    ContentContainerComponent, DatePipe, NgFor, NgIf
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit {
  info: GeneralSeasonStatisticDto | null = null;
  userStats: UserGeneralSeasonStatisticDto | null = null;
  currentUserId: number | null = null;
  teamOfWeek: TeamOfTheRaceDto | null = null;
  currentRace: RaceGetDto | null = null;
  latestRace: RaceGetDto | null = null;
  noActiveSeason = false;

  constructor(
    private statisticService: StatisticService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.statisticService.getGeneralSeasonStatistic().subscribe({
      next: (data) => {
        this.info = data;
        this.loadOtherEndpoints();
      },
      error: (err) => {
        if (
          err.status === 404 &&
          (err.error?.message === 'There is no active season.' || err.error === 'There is no active season.')
        ) {
          this.noActiveSeason = true;
        } else {
          this.info = null;
        }
      }
    });
  }

  private loadOtherEndpoints() {
    this.statisticService.getLatestTeamOfTheRace().subscribe({
      next: (data) => this.teamOfWeek = data,
      error: (err) => {
        if (err.status === 404) this.teamOfWeek = null;
      }
    });

    this.authService.userProfile$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
      if (this.currentUserId) {
        this.statisticService.getUserGeneralSeasonStatistic(this.currentUserId).subscribe({
          next: (data) => this.userStats = data,
          error: (err) => {
            if (err.status === 404) this.userStats = null;
          }
        });
      }
    });

    this.statisticService.getCurrentRace().subscribe({
      next: (data) => this.currentRace = data,
      error: (err) => {
        if (err.status === 404) this.currentRace = null;
      }
    });

    this.statisticService.getLatestRace().subscribe({
      next: (data) => this.latestRace = data,
      error: (err) => {
        if (err.status === 404) this.latestRace = null;
      }
    });
  }
}
