import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {
  DriverWithAverageFantasyPointScoredGetDto,
  DriverWithDnfsGetDto,
  DriverWithFastestLapsGetDto,
  DriverWithPodiumsGetDto,
  DriverWithRaceWinsGetDto,
  DriverWithSelectionPercentageGetDto,
  DriverWithTotalFantasyPointScoredGetDto,
  DriverWithTop10FinishesGetDto
} from './dtos/driver-statistic.get.dto';

@Injectable({ providedIn: 'root' })
export class DriverStatisticService {
  constructor(private http: HttpClient) {}

  private baseUrl = `${environment.API_URL}/statistic/public/current-season/drivers`;

  getDriversWithTotalFantasyPointsInCurrentSeason(): Observable<DriverWithTotalFantasyPointScoredGetDto[]> {
    return this.http.get<DriverWithTotalFantasyPointScoredGetDto[]>(
      `${this.baseUrl}/total-points-scored`,
      { withCredentials: true }
    );
  }

  getDriversWithAverageFantasyPointsInCurrentSeason(): Observable<DriverWithAverageFantasyPointScoredGetDto[]> {
    return this.http.get<DriverWithAverageFantasyPointScoredGetDto[]>(
      `${this.baseUrl}/average-points-scored`,
      { withCredentials: true }
    );
  }

  getDriversWithSelectionPercentageInCurrentSeason(): Observable<DriverWithSelectionPercentageGetDto[]> {
    return this.http.get<DriverWithSelectionPercentageGetDto[]>(
      `${this.baseUrl}/selection-percentage`,
      { withCredentials: true }
    );
  }

  getDriversWithRaceWinsInCurrentSeason(): Observable<DriverWithRaceWinsGetDto[]> {
    return this.http.get<DriverWithRaceWinsGetDto[]>(
      `${this.baseUrl}/race-wins`,
      { withCredentials: true }
    );
  }

  getDriversWithPodiumsInCurrentSeason(): Observable<DriverWithPodiumsGetDto[]> {
    return this.http.get<DriverWithPodiumsGetDto[]>(
      `${this.baseUrl}/podiums`,
      { withCredentials: true }
    );
  }

  getDriversWithTop10FinishesInCurrentSeason(): Observable<DriverWithTop10FinishesGetDto[]> {
    return this.http.get<DriverWithTop10FinishesGetDto[]>(
      `${this.baseUrl}/top-10-finishes`,
      { withCredentials: true }
    );
  }

  getDriversWithFastestLapsInCurrentSeason(): Observable<DriverWithFastestLapsGetDto[]> {
    return this.http.get<DriverWithFastestLapsGetDto[]>(
      `${this.baseUrl}/fastest-laps`,
      { withCredentials: true }
    );
  }

  getDriversWithDnfsInCurrentSeason(): Observable<DriverWithDnfsGetDto[]> {
    return this.http.get<DriverWithDnfsGetDto[]>(
      `${this.baseUrl}/dnfs`,
      { withCredentials: true }
    );
  }
}
