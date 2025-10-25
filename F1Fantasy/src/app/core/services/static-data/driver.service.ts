import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {DriverGetDto, DriverSearchResultDto} from './dtos/driver.get.dto';
@Injectable({ providedIn: 'root' })
export class DriverService {
  constructor(private http: HttpClient) {}
  getAllDrivers(): Observable<DriverGetDto[]> {
    return this.http.get<DriverGetDto[]>(`${environment.API_URL}/static-data/drivers`, { withCredentials: true });
  }

  SearchDrivers(query: string, pageNum: number = 1, pageSize: number = 10): Observable<DriverSearchResultDto> {
    const params = new HttpParams()
      .set('query', query)
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);

    return this.http.get<DriverSearchResultDto>(
      `${environment.API_URL}/driver/search`,
      { params, withCredentials: true }
    );
  }
}
