import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { FantasyLineupDto } from './dtos/fantay-lineup.get.dto';

@Injectable({ providedIn: 'root' })
export class FantasyLineupService {
  constructor(private http: HttpClient) {}

  getCurrentLineup(userId: number): Observable<FantasyLineupDto> {
    return this.http.get<FantasyLineupDto>(
      `${environment.API_URL}/fantasy-lineup/${userId}/current`,
      { withCredentials: true }
    );
  }
}
