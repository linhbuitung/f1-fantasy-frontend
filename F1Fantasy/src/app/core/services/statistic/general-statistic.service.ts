import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {
  DriverWithAverageFantasyPointScoredGetDto,
  DriverWithTotalFantasyPointScoredGetDto
} from './dtos/driver-statistic.get.dto';

@Injectable({ providedIn: 'root' })
export class GeneralStatisticService {
  constructor(private http: HttpClient) {
  }

  getDriversWithTotalFantasyPointsInCurrentSeason(): Observable<DriverWithTotalFantasyPointScoredGetDto[]> {
    return this.http.get<DriverWithTotalFantasyPointScoredGetDto[]>(
      `${environment.API_URL}/statistic/current-season/drivers/total-points-scored`,
      { withCredentials: true }
    );
  }

  getDriversWithAverageFantasyPointsInCurrentSeason(): Observable<DriverWithAverageFantasyPointScoredGetDto[]> {
    return this.http.get<DriverWithAverageFantasyPointScoredGetDto[]>(
      `${environment.API_URL}/statistic/current-season/drivers/average-points-scored`,
      { withCredentials: true }
    );
  }
}
