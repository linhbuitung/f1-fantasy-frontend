import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {CountryGetDto} from './dtos/country.get.dto';

@Injectable({ providedIn: 'root' })
export class CountryService {
  constructor(private http: HttpClient) {}
  getAllCountries(): Observable<CountryGetDto[]> {
    return this.http.get<CountryGetDto[]>(`${environment.API_URL}/static-data/countries`, { withCredentials: true });
  }
}
