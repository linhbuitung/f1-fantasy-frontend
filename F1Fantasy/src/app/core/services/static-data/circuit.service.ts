import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {CircuitSearchResultDto} from './dtos/circuit.get.dto';

@Injectable({ providedIn: 'root' })
export class CircuitService {
  constructor(private http: HttpClient) {}
  SearchCircuits(query: string, pageNum: number = 1, pageSize: number = 10): Observable<CircuitSearchResultDto> {
    const params = new HttpParams()
      .set('query', query)
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);

    return this.http.get<CircuitSearchResultDto>(
      `${environment.API_URL}/circuit/search`,
      { params, withCredentials: true }
    );
  }

}
