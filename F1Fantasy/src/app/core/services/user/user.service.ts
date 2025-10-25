import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {UserGetDto, UserSearchResultDto} from './dtos/user.get.dto';
import { UserUpdateDto } from './dtos/user.update.dto';
import {Observable, tap} from 'rxjs';
import {UserResetPasswordDto} from './dtos/reset-password.dto';
import {AuthService} from '../auth/auth.service';
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserById(id: string): Observable<UserGetDto> {
    return this.http.get<UserGetDto>(`${environment.API_URL}/user/${id}`, { withCredentials: true });
  }

  // getAllUsers(): Observable<UserListItemDto[]> {
  //   return this.http.get<UserListItemDto[]>(`${environment.apiUrl}/user`, { withCredentials: true });
  // }

  updateUser(id: string, data: UserUpdateDto): Observable<UserGetDto> {
    return this.http.put<UserGetDto>(`${environment.API_URL}/user/${id}/update`,
      data,
      { withCredentials: true })
      .pipe(tap({
        next: () => {
          this.authService.loadProfile();
        }
      })
    );
  }
  sendResetCode(email: string) {
    return this.http.post(`${environment.API_URL}/forgot-password`, { email }, { withCredentials: true });
  }

  resetPassword(data: UserResetPasswordDto) {
    return this.http.post(`${environment.API_URL}/reset-password`, data, { withCredentials: true });
  }

  SearchUsers(query: string, pageNum: number = 1, pageSize: number = 10): Observable<UserSearchResultDto> {
    const params = new HttpParams()
      .set('query', query)
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);

    return this.http.get<UserSearchResultDto>(
      `${environment.API_URL}/user/search`,
      { params, withCredentials: true }
    );
  }
}
