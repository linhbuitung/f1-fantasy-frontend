import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStatisticService } from '../../../core/services/statistic/user-statistic.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, catchError, tap, finalize } from 'rxjs/operators';
import {
  UserStatisticGetDto,
  UserWithTotalFantasyPointScoredGetDto,
  UserWithAveragePointScoredGetDto
} from '../../../core/services/statistic/dtos/user-statistic.get.dto';

type MetricKey = 'total' | 'average';

@Component({
  selector: 'app-player-statistic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-statistic.component.html',
  styleUrl: './player-statistic.component.scss'
})
export class PlayerStatisticComponent implements OnInit {
  private selected$ = new BehaviorSubject<MetricKey>('total');
  items$: Observable<UserStatisticGetDto[]> = of([]);
  loading = false;
  selectedKey: MetricKey = 'total';

  readonly gameStats = [
    { key: 'total' as MetricKey, label: 'Total fantasy points scored' },
    { key: 'average' as MetricKey, label: 'Average fantasy points scored' }
  ];

  readonly raceStats: { key: MetricKey; label: string }[] = [];

  constructor(private svc: UserStatisticService) {}

  ngOnInit(): void {
    this.items$ = this.selected$.pipe(
      tap(k => { this.selectedKey = k; }),
      switchMap(k =>
        this.loadMetric(k).pipe(
          catchError(err => {
            console.error('Failed to load user statistics', err);
            return of([] as UserStatisticGetDto[]);
          }),
          finalize(() => (this.loading = false))
        )
      )
    );

    this.loading = true;
    Promise.resolve().then(() => this.selected$.next(this.selectedKey));
  }

  selectMetric(k: MetricKey) {
    if (this.selected$.value === k) return;
    this.selectedKey = k;
    this.loading = true;
    this.selected$.next(k);
  }

  private loadMetric(k: MetricKey): Observable<UserStatisticGetDto[]> {
    switch (k) {
      case 'total':
        return this.svc.getUsersWithTotalFantasyPointsInCurrentSeason() as Observable<UserWithTotalFantasyPointScoredGetDto[]>;
      case 'average':
        return this.svc.getUsersWithAverageFantasyPointsInCurrentSeason() as Observable<UserWithAveragePointScoredGetDto[]>;
      default:
        return of([]);
    }
  }

  displayMetricValue(item: any): string {
    switch (this.selectedKey) {
      case 'total':
        return (item.totalFantasyPointScored != null) ? String(item.totalFantasyPointScored) : '0';
      case 'average':
        return (item.averageFantasyPointScored != null) ? Number(item.averageFantasyPointScored).toFixed(2) : '0';
      default:
        return '-';
    }
  }

  trackById(_: number, item: UserStatisticGetDto) {
    return item.id;
  }

  get selectedMetricLabel(): string {
    const combined = (this.gameStats ?? []).concat(this.raceStats ?? []);
    const found = combined.find(s => s.key === this.selectedKey);
    return found?.label ?? '';
  }
}
