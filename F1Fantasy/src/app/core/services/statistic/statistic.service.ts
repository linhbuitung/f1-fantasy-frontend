import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { GeneralSeasonStatisticDto } from './dtos/general-season-statistic.get.dto';
import {UserGeneralSeasonStatisticDto} from './dtos/user-general-season-statistic.get.dto';
import { TeamOfTheRaceDto } from './dtos/team-of-the-race.get.dto';
import { RaceDto } from './dtos/race.get.dto';

@Injectable({ providedIn: 'root' })
export class StatisticService {
  constructor(private http: HttpClient) {}

  getGeneralSeasonStatistic(): Observable<GeneralSeasonStatisticDto> {
    return this.http.get<GeneralSeasonStatisticDto>(
      `${environment.API_URL}/statistic/general/current-season`,
      { withCredentials: true }
    );
  }

  getUserGeneralSeasonStatistic(userId: number): Observable<UserGeneralSeasonStatisticDto> {
    return this.http.get<UserGeneralSeasonStatisticDto>(
      `${environment.API_URL}/statistic/general/current-season/user/${userId}`,
      { withCredentials: true }
    );
  }


  getLatestTeamOfTheRace(): Observable<TeamOfTheRaceDto> {
    return this.http.get<TeamOfTheRaceDto>(
      `${environment.API_URL}/statistic/general/team-of-the-race/latest`,
      { withCredentials: true }
    );
  }

  getCurrentRace(): Observable<RaceDto> {
    return this.http.get<RaceDto>(
      `${environment.API_URL}/core/race/current`,
      { withCredentials: true }
    );
  }

  getLatestRace(): Observable<RaceDto> {
    return this.http.get<RaceDto>(
      `${environment.API_URL}/core/race/latest`,
      { withCredentials: true }
    );
  }
}
