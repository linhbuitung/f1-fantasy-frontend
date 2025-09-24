import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LoginDto } from './dtos/login.dtos';
import { RegisterDto } from './dtos/register.dtos';
import {BehaviorSubject, tap} from 'rxjs';
import {UserGetDto} from '../user/dtos/user.get.dto';


@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {
    this.loadProfile(); // Fetch profile on service init
  }

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  private userProfile = new BehaviorSubject<UserGetDto | null>(null);
  userProfile$ = this.userProfile.asObservable();


  setLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }

  login(credentials: LoginDto) {
    return this.http.post(
      `${environment.API_URL}/login`,
      credentials,
      { withCredentials: true }
    );
  }

  register(data: RegisterDto) {
    return this.http.post(
      `${environment.API_URL}/register`,
      data,
      { withCredentials: true }
    );
  }

  logout() {
    return this.http.post(
      `${environment.API_URL}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.userProfile.next(null);
        this.setLoggedIn(false);
      })
    );
  }

  loadProfile() {
    this.http.get<UserGetDto>(`${environment.API_URL}/user/me`, { withCredentials: true })
      .subscribe({
        next: (profile) => {
          this.userProfile.next(profile);
          this.setLoggedIn(true);
        },
        error: (err) => {
          console.log(err);
          this.userProfile.next(null);
          this.setLoggedIn(false);
        }
      });
  }
}
