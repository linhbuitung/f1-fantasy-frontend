import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { DriverStatisticService } from '../../../core/services/statistic/driver-statistic.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, catchError, tap, finalize } from 'rxjs/operators';
import {
  DriverStatisticGetDto,
  DriverWithTotalFantasyPointScoredGetDto,
  DriverWithAverageFantasyPointScoredGetDto,
  DriverWithSelectionPercentageGetDto,
  DriverWithRaceWinsGetDto,
  DriverWithPodiumsGetDto,
  DriverWithTop10FinishesGetDto,
  DriverWithFastestLapsGetDto,
  DriverWithDnfsGetDto
} from '../../../core/services/statistic/dtos/driver-statistic.get.dto';

type MetricKey =
  | 'total'
  | 'average'
  | 'selection'
  | 'raceWins'
  | 'podiums'
  | 'top10'
  | 'fastestLaps'
  | 'dnfs';

@Component({
  selector: 'app-driver-statistic',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './driver-statistic.component.html',
  styleUrl: './driver-statistic.component.scss'
})
export class DriverStatisticComponent implements OnInit {
  private selected$ = new BehaviorSubject<MetricKey>('total');
  items$: Observable<DriverStatisticGetDto[]> = of([]);
  loading = false;
  selectedKey: MetricKey = 'total';

  // friendly labels for left menu
  readonly gameStats = [
    { key: 'total' as MetricKey, label: 'Total fantasy points scored' },
    { key: 'average' as MetricKey, label: 'Average fantasy points scored' },
    { key: 'selection' as MetricKey, label: 'Selection %' }
  ];

  readonly raceStats = [
    { key: 'raceWins' as MetricKey, label: 'Race wins' },
    { key: 'podiums' as MetricKey, label: 'Podiums' },
    { key: 'top10' as MetricKey, label: 'Top 10 finishes' },
    { key: 'fastestLaps' as MetricKey, label: 'Fastest laps' },
    { key: 'dnfs' as MetricKey, label: 'DNFs' }
  ];

  constructor(private svc: DriverStatisticService) {}

  ngOnInit(): void {
    // create the pipeline (async pipe in template will subscribe)
    this.items$ = this.selected$.pipe(
      tap(k => { this.selectedKey = k; }),
      switchMap((k) =>
        this.loadMetric(k).pipe(
          catchError((err) => {
            console.error('Failed to load driver statistics', err);
            return of([] as DriverStatisticGetDto[]);
          }),
          finalize(() => (this.loading = false))
        )
      )
    );

    // ensure subscription happens before emitting initial value
    this.loading = true;
    Promise.resolve().then(() => this.selected$.next(this.selectedKey));
  }

  selectMetric(k: MetricKey) {
    if (this.selected$.value === k) return;
    this.selectedKey = k;
    this.loading = true; // start loading before emission to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.selected$.next(k);
  }

  private loadMetric(k: MetricKey): Observable<DriverStatisticGetDto[]> {
    switch (k) {
      case 'total':
        return this.svc.getDriversWithTotalFantasyPointsInCurrentSeason() as Observable<DriverWithTotalFantasyPointScoredGetDto[]>;
      case 'average':
        return this.svc.getDriversWithAverageFantasyPointsInCurrentSeason() as Observable<DriverWithAverageFantasyPointScoredGetDto[]>;
      case 'selection':
        return this.svc.getDriversWithSelectionPercentageInCurrentSeason() as Observable<DriverWithSelectionPercentageGetDto[]>;
      case 'raceWins':
        return this.svc.getDriversWithRaceWinsInCurrentSeason() as Observable<DriverWithRaceWinsGetDto[]>;
      case 'podiums':
        return this.svc.getDriversWithPodiumsInCurrentSeason() as Observable<DriverWithPodiumsGetDto[]>;
      case 'top10':
        return this.svc.getDriversWithTop10FinishesInCurrentSeason() as Observable<DriverWithTop10FinishesGetDto[]>;
      case 'fastestLaps':
        return this.svc.getDriversWithFastestLapsInCurrentSeason() as Observable<DriverWithFastestLapsGetDto[]>;
      case 'dnfs':
        return this.svc.getDriversWithDnfsInCurrentSeason() as Observable<DriverWithDnfsGetDto[]>;
      default:
        return of([]);
    }
  }

  // Display metric value depending on selectedKey
  displayMetricValue(item: any): string {
    switch (this.selectedKey) {
      case 'total':
        return (item.totalFantasyPointScored ?? item.totalFantasyPointScored === 0) ? String(item.totalFantasyPointScored) : '0';
      case 'average':
        return (item.averageFantasyPointScored != null) ? (Number(item.averageFantasyPointScored).toFixed(2)) : '0';
      case 'selection':
        return (item.selectionPercentage != null) ? `${item.selectionPercentage}%` : '0%';
      case 'raceWins':
        return (item.totalRacesWin != null) ? String(item.totalRacesWin) : '0';
      case 'podiums':
        return (item.totalPodiums != null) ? String(item.totalPodiums) : '0';
      case 'top10':
        return (item.totalTop10Finishes != null) ? String(item.totalTop10Finishes) : '0';
      case 'fastestLaps':
        return (item.totalFastestLaps != null) ? String(item.totalFastestLaps) : '0';
      case 'dnfs':
        return (item.totalDnfs != null) ? String(item.totalDnfs) : '0';
      default:
        return '-';
    }
  }

  trackById(_: number, item: DriverStatisticGetDto) {
    return item.id;
  }

  get selectedMetricLabel(): string {
    const combined = (this.gameStats ?? []).concat(this.raceStats ?? []);
    const found = combined.find(s => s.key === this.selectedKey);
    return found?.label ?? '';
  }
}
