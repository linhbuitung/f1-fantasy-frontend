import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {ConstructorGetDto} from './dtos/constructor.get.dto';

@Injectable({ providedIn: 'root' })
export class ConstructorService {
  constructor(private http: HttpClient) {}
  getAllConstructors(): Observable<ConstructorGetDto[]> {
    return this.http.get<ConstructorGetDto[]>(`${environment.API_URL}/static-data/constructors`, { withCredentials: true });
  }
}
