import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {RaceStatisticGetDto, RaceStatisticMinimalGetDto} from './dtos/race-statistic-minimal-get.dto';

@Injectable({ providedIn: 'root' })
export class RaceStatisticService {
  private baseUrl = `${environment.API_URL}/static-data/races`;

  constructor(private http: HttpClient) {}

  /**
   * Get races for a given season year.
   */
  getRacesByYear(year: number): Observable<RaceStatisticMinimalGetDto[]> {
    return this.http.get<RaceStatisticMinimalGetDto[]>(
      `${this.baseUrl}/year/${year}`,
      { withCredentials: true }
    );
  }

  /**
      * Get race statistics by race id
      * GET /statistic/public/current-season/races/{raceId}
      */
  getRaceStatisticById(raceId: number): Observable<RaceStatisticGetDto> {
    return this.http.get<RaceStatisticGetDto>(
        `${environment.API_URL}/statistic/public/current-season/races/${raceId}`,
        { withCredentials: true }
      );
  }
}
