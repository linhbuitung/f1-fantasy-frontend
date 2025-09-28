import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {RaceDto} from './dtos/race.get.dto';
import {PowerupForUserDto} from './dtos/powerup-for-user.get.dto';

@Injectable({ providedIn: 'root' })
export class CoreGameplayService {
  constructor(private http: HttpClient) {
  }

  getCurrentRace(): Observable<RaceDto> {
    return this.http.get<RaceDto>(
      `${environment.API_URL}/core/race/current`,
      {withCredentials: true}
    );
  }

  GetAllPowerupsWithStatusByUserId(userId: number): Observable<PowerupForUserDto[]> {
    return this.http.get<PowerupForUserDto[]>(`${environment.API_URL}/core/powerups/user/${userId}`, {withCredentials: true});
  }

  AddPowerToCurrentLineupOfUser(userId: number, powerupId: number): Observable<void> {
    return this.http.post<void>(`${environment.API_URL}/core/fantasy-lineup/${userId}/current/powerup/${powerupId}/add`, {}, {withCredentials: true});
  }

  RemovePowerFromCurrentLineupOfUser(userId: number, powerupId: number): Observable<void> {
    return this.http.post<void>(`${environment.API_URL}/core/fantasy-lineup/${userId}/current/powerup/${powerupId}/remove`, {}, {withCredentials: true});
  }
}
