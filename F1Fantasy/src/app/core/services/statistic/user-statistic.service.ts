import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  UserWithTotalFantasyPointScoredGetDto,
  UserWithAveragePointScoredGetDto
} from './dtos/user-statistic.get.dto';

@Injectable({ providedIn: 'root' })
export class UserStatisticService {
  private baseUrl = `${environment.API_URL}/statistic/public/current-season/players`;

  constructor(private http: HttpClient) {}

  getUsersWithTotalFantasyPointsInCurrentSeason(): Observable<UserWithTotalFantasyPointScoredGetDto[]> {
    return this.http.get<UserWithTotalFantasyPointScoredGetDto[]>(
      `${this.baseUrl}/total-points-scored`,
      { withCredentials: true }
    );
  }

  getUsersWithAverageFantasyPointsInCurrentSeason(): Observable<UserWithAveragePointScoredGetDto[]> {
    return this.http.get<UserWithAveragePointScoredGetDto[]>(
      `${this.baseUrl}/average-points-scored`,
      { withCredentials: true }
    );
  }
}
