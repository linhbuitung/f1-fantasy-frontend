import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RaceStatisticService } from '../../../core/services/statistic/race-statistic.service';
import { RaceStatisticGetDto, RaceStatisticMinimalGetDto } from '../../../core/services/statistic/dtos/race-statistic-minimal-get.dto';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-race-statistic',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NgOptimizedImage],
  templateUrl: './race-statistic.component.html',
  styleUrl: './race-statistic.component.scss'
})
export class RaceStatisticComponent implements OnInit {
  races: RaceStatisticMinimalGetDto[] = [];
  selectedRaceStat: RaceStatisticGetDto | null = null;
  loadingRaces = false;
  loadingStat = false;
  serverError: string | null = null;

  constructor(private raceSvc: RaceStatisticService) {}

  ngOnInit(): void {
    this.loadRacesForCurrentYear();
  }

  private loadRacesForCurrentYear(): void {
    const year = new Date().getFullYear();
    this.loadingRaces = true;
    this.serverError = null;
    this.raceSvc.getRacesByYear(year).subscribe({
      next: (items) => {
        // keep order by round asc for sidebar convenience
        this.races = (items || []).slice().sort((a, b) => (a.round ?? 0) - (b.round ?? 0));
        this.loadingRaces = false;

        // pick default: latest calculated race (highest round with calculated===true)
        const calculated = this.races.filter(r => r.calculated);
        let defaultRace = calculated.length ? calculated.sort((a, b) => (b.round ?? 0) - (a.round ?? 0))[0] : null;
        // fallback: pick the last race by round if none calculated
        if (!defaultRace && this.races.length) {
          defaultRace = this.races.slice().sort((a, b) => (b.round ?? 0) - (a.round ?? 0))[0];
        }
        if (defaultRace) this.selectRace(defaultRace.id);
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to load races';
        this.loadingRaces = false;
      }
    });
  }

  selectRace(raceId: number): void {
    this.loadingStat = true;
    this.selectedRaceStat = null;
    this.serverError = null;
    this.raceSvc.getRaceStatisticById(raceId).subscribe({
      next: (dto) => {
        this.selectedRaceStat = dto;
        this.loadingStat = false;
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to load race statistic';
        this.loadingStat = false;
      }
    });
  }
}
