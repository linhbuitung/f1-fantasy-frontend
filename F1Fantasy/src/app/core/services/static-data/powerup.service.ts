import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {PowerupGetDto} from './dtos/powerup.get.dto';
@Injectable({ providedIn: 'root' })
export class PowerupService {
  constructor(private http: HttpClient) {}
  getAllPowerups(): Observable<PowerupGetDto[]> {
    return this.http.get<PowerupGetDto[]>(`${environment.API_URL}/static-data/powerups`, { withCredentials: true });
  }
}
