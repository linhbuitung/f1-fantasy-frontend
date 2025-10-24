import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstructorStatisticService } from '../../../core/services/statistic/constructor-statistic.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, catchError, tap, finalize } from 'rxjs/operators';
import {
  ConstructorStatisticGetDto,
  ConstructorWithTotalFantasyPointScoredGetDto,
  ConstructorWithAverageFantasyPointScoredGetDto,
  ConstructorWithSelectionPercentageGetDto,
  ConstructorWithPodiumsGetDto,
  ConstructorWithTop10FinishesGetDto
} from '../../../core/services/statistic/dtos/constructor-statistic.get.dto';

type MetricKey = 'total' | 'average' | 'selection' | 'podiums' | 'top10';

@Component({
  selector: 'app-constructor-statistic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './constructor-statistic.component.html',
  styleUrl: './constructor-statistic.component.scss'
})
export class ConstructorStatisticComponent implements OnInit {
  private selected$ = new BehaviorSubject<MetricKey>('total');
  items$: Observable<ConstructorStatisticGetDto[]> = of([]);
  loading = false;
  selectedKey: MetricKey = 'total';

  readonly gameStats = [
    { key: 'total' as MetricKey, label: 'Total fantasy points scored' },
    { key: 'average' as MetricKey, label: 'Average fantasy points scored' },
    { key: 'selection' as MetricKey, label: 'Selection %' }
  ];

  readonly raceStats = [
    { key: 'podiums' as MetricKey, label: 'Podiums' },
    { key: 'top10' as MetricKey, label: 'Top 10 finishes' }
  ];

  constructor(private svc: ConstructorStatisticService) {}

  ngOnInit(): void {
    this.items$ = this.selected$.pipe(
      tap(k => { this.selectedKey = k; }),
      switchMap(k =>
        this.loadMetric(k).pipe(
          catchError((err) => {
            console.error('Failed to load constructor statistics', err);
            return of([] as ConstructorStatisticGetDto[]);
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

  private loadMetric(k: MetricKey): Observable<ConstructorStatisticGetDto[]> {
    switch (k) {
      case 'total':
        return this.svc.getConstructorsWithTotalFantasyPointsInCurrentSeason() as Observable<ConstructorWithTotalFantasyPointScoredGetDto[]>;
      case 'average':
        return this.svc.getConstructorsWithAverageFantasyPointsInCurrentSeason() as Observable<ConstructorWithAverageFantasyPointScoredGetDto[]>;
      case 'selection':
        return this.svc.getConstructorsWithSelectionPercentageInCurrentSeason() as Observable<ConstructorWithSelectionPercentageGetDto[]>;
      case 'podiums':
        return this.svc.getConstructorsWithPodiumsInCurrentSeason() as Observable<ConstructorWithPodiumsGetDto[]>;
      case 'top10':
        return this.svc.getConstructorsWithTop10FinishesInCurrentSeason() as Observable<ConstructorWithTop10FinishesGetDto[]>;
      default:
        return of([]);
    }
  }

  displayMetricValue(item: any): string {
    switch (this.selectedKey) {
      case 'total':
        return (item.totalFantasyPointScored ?? item.totalFantasyPointScored === 0) ? String(item.totalFantasyPointScored) : '0';
      case 'average':
        return (item.averageFantasyPointScored != null) ? Number(item.averageFantasyPointScored).toFixed(2) : '0';
      case 'selection':
        return (item.selectionPercentage != null) ? `${item.selectionPercentage}%` : '0%';
      case 'podiums':
        return (item.totalPodiums != null) ? String(item.totalPodiums) : '0';
      case 'top10':
        return (item.totalTop10Finishes != null) ? String(item.totalTop10Finishes) : '0';
      default:
        return '-';
    }
  }

  trackById(_: number, item: ConstructorStatisticGetDto) {
    return item.id;
  }

  get selectedMetricLabel(): string {
    const combined = (this.gameStats ?? []).concat(this.raceStats ?? []);
    const found = combined.find(s => s.key === this.selectedKey);
    return found?.label ?? '';
  }
}
