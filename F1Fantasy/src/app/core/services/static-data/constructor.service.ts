import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {ConstructorGetDto, ConstructorSearchResultDto} from './dtos/constructor.get.dto';

@Injectable({ providedIn: 'root' })
export class ConstructorService {
  constructor(private http: HttpClient) {}
  getAllConstructors(): Observable<ConstructorGetDto[]> {
    return this.http.get<ConstructorGetDto[]>(`${environment.API_URL}/static-data/constructors`, { withCredentials: true });
  }

  SearchConstructors(query: string, pageNum: number = 1, pageSize: number = 10): Observable<ConstructorSearchResultDto> {
    const params = new HttpParams()
      .set('query', query)
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);

    return this.http.get<ConstructorSearchResultDto>(
      `${environment.API_URL}/constructor/search`,
      { params, withCredentials: true }
    );
  }
}
