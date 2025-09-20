import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginDto } from '../dtos/login.dtos';
import { RegisterDto } from '../dtos/register.dtos';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  // Call this after login/logout
  setLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }
  login(credentials: LoginDto) {
    return this.http.post(
      `${environment.apiUrl}/login`,
      credentials,
      { withCredentials: true }
    );
  }

  register(data: RegisterDto) {
    return this.http.post(
      `${environment.apiUrl}/register`,
      data,
      { withCredentials: true }
    );
  }

  logout() {
    return this.http.post(
      `${environment.apiUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }

}