import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UserGetDto } from './dtos/user.get.dto';
import { UserUpdateDto } from './dtos/user.update.dto';
import { Observable } from 'rxjs';
import {UserResetPasswordDto} from './dtos/reset-password.dto';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<UserGetDto> {
    return this.http.get<UserGetDto>(`${environment.API_URL}/user/${id}`, { withCredentials: true });
  }

  // getAllUsers(): Observable<UserListItemDto[]> {
  //   return this.http.get<UserListItemDto[]>(`${environment.apiUrl}/user`, { withCredentials: true });
  // }

  updateUser(id: string, data: UserUpdateDto): Observable<UserGetDto> {
    return this.http.put<UserGetDto>(`${environment.API_URL}/user/${id}/update`, data, { withCredentials: true });
  }

  findUsersByDisplayName(name: string): Observable<UserGetDto[]> {
    return this.http.get<UserGetDto[]>(`${environment.API_URL}/user/search`, {
      params: { displayName: name },
      withCredentials: true
    });
  }

  sendResetCode(email: string) {
    return this.http.post(`${environment.API_URL}/forgot-password`, { email }, { withCredentials: true });
  }

  resetPassword(data: UserResetPasswordDto) {
    return this.http.post(`${environment.API_URL}/user/reset-password`, data, { withCredentials: true });
  }
}
