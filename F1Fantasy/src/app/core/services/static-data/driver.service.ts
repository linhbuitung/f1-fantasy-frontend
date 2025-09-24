import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {DriverGetDto} from './dtos/driver.get.dto';
@Injectable({ providedIn: 'root' })
export class DriverService {
  constructor(private http: HttpClient) {}
  getAllDrivers(): Observable<DriverGetDto[]> {
    return this.http.get<DriverGetDto[]>(`${environment.apiUrl}/static-data/drivers`, { withCredentials: true });
  }
}
