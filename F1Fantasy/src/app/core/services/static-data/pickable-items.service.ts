import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PickableItemDto } from './dtos/pickable-items.get.dto';

@Injectable({ providedIn: 'root' })
export class PickableItemsService {
  constructor(private http: HttpClient) {}

  getPickableItems(): Observable<PickableItemDto> {
    return this.http.get<PickableItemDto>(
      `${environment.API_URL}/admin/pickable-items`,
      { withCredentials: true }
    );
  }
}
