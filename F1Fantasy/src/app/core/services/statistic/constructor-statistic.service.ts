import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  ConstructorWithAverageFantasyPointScoredGetDto,
  ConstructorWithSelectionPercentageGetDto,
  ConstructorWithTotalFantasyPointScoredGetDto,
  ConstructorWithPodiumsGetDto,
  ConstructorWithTop10FinishesGetDto
} from './dtos/constructor-statistic.get.dto';

@Injectable({ providedIn: 'root' })
export class ConstructorStatisticService {
  private baseUrl = `${environment.API_URL}/statistic/public/current-season/constructors`;

  constructor(private http: HttpClient) {}

  getConstructorsWithTotalFantasyPointsInCurrentSeason(): Observable<ConstructorWithTotalFantasyPointScoredGetDto[]> {
    return this.http.get<ConstructorWithTotalFantasyPointScoredGetDto[]>(
      `${this.baseUrl}/total-points-scored`,
      { withCredentials: true }
    );
  }

  getConstructorsWithAverageFantasyPointsInCurrentSeason(): Observable<ConstructorWithAverageFantasyPointScoredGetDto[]> {
    return this.http.get<ConstructorWithAverageFantasyPointScoredGetDto[]>(
      `${this.baseUrl}/average-points-scored`,
      { withCredentials: true }
    );
  }

  getConstructorsWithSelectionPercentageInCurrentSeason(): Observable<ConstructorWithSelectionPercentageGetDto[]> {
    return this.http.get<ConstructorWithSelectionPercentageGetDto[]>(
      `${this.baseUrl}/selection-percentage`,
      { withCredentials: true }
    );
  }

  getConstructorsWithPodiumsInCurrentSeason(): Observable<ConstructorWithPodiumsGetDto[]> {
    return this.http.get<ConstructorWithPodiumsGetDto[]>(
      `${this.baseUrl}/podiums`,
      { withCredentials: true }
    );
  }

  getConstructorsWithTop10FinishesInCurrentSeason(): Observable<ConstructorWithTop10FinishesGetDto[]> {
    return this.http.get<ConstructorWithTop10FinishesGetDto[]>(
      `${this.baseUrl}/top-10-finishes`,
      { withCredentials: true }
    );
  }
}
