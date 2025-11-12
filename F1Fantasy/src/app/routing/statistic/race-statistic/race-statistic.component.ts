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
  // Sorting for drivers list: 'points' = points desc, 'final' = final position asc, 'grid' = grid asc
  sortKey: 'points' | 'final' | 'grid' = 'final';

  constructor(private raceStatisticService: RaceStatisticService) {}

  ngOnInit(): void {
    this.loadRacesForCurrentYear();
  }

  // expose a sorted copy of drivers for template
  get driversSorted() {
        const list = (this.selectedRaceStat?.driversStatistics ?? []).slice();
        switch (this.sortKey) {
            case 'final':
                // Ascending final position; nulls (not finished / not available) go to the end
                  return list.sort((a, b) => {
                    const aPos = a.position ?? Number.POSITIVE_INFINITY;
                    const bPos = b.position ?? Number.POSITIVE_INFINITY;
                    return aPos - bPos;
                  });
              case 'grid':
                // Ascending grid (start) position; nulls to end
                  return list.sort((a, b) => {
                    const aGrid = a.grid ?? Number.POSITIVE_INFINITY;
                    const bGrid = b.grid ?? Number.POSITIVE_INFINITY;
                    return aGrid - bGrid;
                  });
              case 'points':
              default:
                // Points descending
                  return list.sort((a, b) => (b.pointsGained ?? 0) - (a.pointsGained ?? 0));
            }
      }

  setSort(k: 'points' | 'final' | 'grid') {
        if (this.sortKey === k) return;
        this.sortKey = k;
      }

  trackById(_: number, item: { id: number }) {
        return item.id;
      }

  private loadRacesForCurrentYear(): void {
    const year = new Date().getFullYear();
    this.loadingRaces = true;
    this.serverError = null;
    this.raceStatisticService.getRacesByYear(year).subscribe({
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
    this.raceStatisticService.getRaceStatisticById(raceId).subscribe({
      next: (dto) => {
        this.selectedRaceStat = dto;
        // order race entries of driver by point gained
        this.selectedRaceStat.driversStatistics.sort((a, b) => a.pointsGained > b.pointsGained ? -1 : a.pointsGained < b.pointsGained ? 1 : 0)
        // order race entries of constructor by point gained
        this.selectedRaceStat.constructorsStatistics.sort((a, b) => a.pointsGained > b.pointsGained ? -1 : a.pointsGained < b.pointsGained ? 1 : 0)
        this.loadingStat = false;
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to load race statistic';
        this.loadingStat = false;
      }
    });
  }
}
