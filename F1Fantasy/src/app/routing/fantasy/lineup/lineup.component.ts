import { Component, OnInit } from '@angular/core';
import { FantasyLineupService } from '../../../core/services/core-gameplay/fantasy-lineup.service';
import { FantasyLineupDto } from '../../../core/services/core-gameplay/dtos/fantay-lineup.get.dto';
import { AuthService } from '../../../core/services/auth/auth.service';
import {CommonModule, DatePipe, NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import { ContentContainerComponent } from '../../../shared/content-container/content-container.component';
import {CoreGameplayService} from '../../../core/services/core-gameplay/core-gameplay.service';
import {environment} from '../../../../environments/environment';
import {StatisticService} from '../../../core/services/statistic/statistic.service';
import {
  UserGeneralSeasonStatisticDto
} from '../../../core/services/statistic/dtos/user-general-season-statistic.get.dto';
import {RaceDto} from '../../../core/services/statistic/dtos/race.get.dto';
import {PowerupForUserDto} from '../../../core/services/core-gameplay/dtos/powerup-for-user.get.dto';

@Component({
  selector: 'app-lineup',
  imports: [
    ContentContainerComponent, NgIf, DatePipe, NgClass, TitleCasePipe, NgForOf, CommonModule
  ],
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.scss'
})
export class LineupComponent implements OnInit {
  lineup: FantasyLineupDto | null = null;
  latestFinishedLineup: FantasyLineupDto | null = null;
  currentRace: RaceDto | null = null;
  currentUserId: number | null = null;
  lineupValue: number = 0;
  lineupLimit: number = environment.LINEUP_PRICE_LIMIT;
  userStats: UserGeneralSeasonStatisticDto | null = null;
  powerups: PowerupForUserDto[] | null = null;

  constructor(
    private fantasyLineupService: FantasyLineupService,
    private coreGameplayService: CoreGameplayService,
    private authService: AuthService,
    private statisticService: StatisticService) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
      if (this.currentUserId) {
        this.statisticService.getCurrentRace().subscribe({
          next: (data) => this.currentRace = data,
        })
        this.fantasyLineupService.getCurrentLineupByUserId(this.currentUserId).subscribe({
          next: (data) => {
            this.lineup = data;
            this.calculateLineupValue();
          }
        });
        this.fantasyLineupService.getLatestFinishedFantasyLineupByUserId(this.currentUserId).subscribe({
          next: (data) => {
            this.latestFinishedLineup = data;
          }
        });

        this.statisticService.getUserGeneralSeasonStatistic(this.currentUserId).subscribe({
          next: (data) => this.userStats = data,
          error: (err) => {
            if (err.status === 404) this.userStats = null;
          }
        });

        this.coreGameplayService.GetAllPowerupsWithStatusByUserId(this.currentUserId).subscribe({
          next: (data) => this.powerups = data,
        })
      }
    });
  }

  calculateLineupValue() {
    const driverTotal = (this.lineup?.drivers ?? []).reduce((sum: number, d: any) => sum + (d.price ?? 0), 0);
    const constructorTotal = (this.lineup?.constructors ?? []).reduce((sum: number, c: any) => sum + (c.price ?? 0), 0);
    this.lineupValue = driverTotal + constructorTotal;
  }

  addPowerToLineup(powerup: PowerupForUserDto) {
  if (!this.currentUserId) return;
  this.coreGameplayService.AddPowerToCurrentLineupOfUser(this.currentUserId, powerup.id).subscribe({
    next: () => this.reloadPowerups(),
  });
}

removePowerFromLineup(powerup: PowerupForUserDto) {
  if (!this.currentUserId) return;
  this.coreGameplayService.RemovePowerFromCurrentLineupOfUser(this.currentUserId, powerup.id).subscribe({
    next: () => this.reloadPowerups(),
  });
}

reloadPowerups() {
  if (!this.currentUserId) return;
  this.coreGameplayService.GetAllPowerupsWithStatusByUserId(this.currentUserId).subscribe({
    next: (data) => this.powerups = data,
  });
}
}
