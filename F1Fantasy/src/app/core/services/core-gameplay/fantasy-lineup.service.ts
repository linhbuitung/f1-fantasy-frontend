import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { FantasyLineupDto } from './dtos/fantay-lineup.get.dto';
import {FantasyLineupUpdateDto} from './dtos/fantasy-lineup.update.dto';

@Injectable({ providedIn: 'root' })
export class FantasyLineupService {
  constructor(private http: HttpClient) {}

  getCurrentLineupByUserId(userId: number): Observable<FantasyLineupDto> {
    return this.http.get<FantasyLineupDto>(
      `${environment.API_URL}/core/fantasy-lineup/${userId}/current`,
      { withCredentials: true }
    );
  }

  getLatestFinishedFantasyLineupByUserId(userId: number): Observable<FantasyLineupDto> {
    return this.http.get<FantasyLineupDto>(
      `${environment.API_URL}/core/fantasy-lineup/${userId}/latest-finished`,
      { withCredentials: true }
    );
  }

  updateCurrentLineup(userId: number, dto: FantasyLineupUpdateDto): Observable<FantasyLineupDto> {
    return this.http.put<FantasyLineupDto>(
      `${environment.API_URL}/core/fantasy-lineup/${userId}/current`,
      dto,
      { withCredentials: true }
    );
  }
}
