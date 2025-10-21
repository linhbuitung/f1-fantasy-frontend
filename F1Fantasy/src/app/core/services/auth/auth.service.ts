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
    ).pipe(
      tap({
        next: () => {
          this.setLoggedIn(true);
          this.loadProfile();
        },
        error: () => {
          // Do not set loggedIn or loadProfile on error
          this.setLoggedIn(false);
          this.userProfile.next(null);
        }
      })
    );
  }

  register(data: RegisterDto) {
    return this.http.post(
      `${environment.API_URL}/register`,
      data,
      { withCredentials: true }
    ).pipe(
      tap({
        next: () => {
          this.setLoggedIn(true);
          this.loadProfile();
        },
        error: () => {
          this.setLoggedIn(false);
          this.userProfile.next(null);
        }
      })
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
    // Only fetch if it's logged in and userProfile is null
    if(!this.loggedIn.value) {
      return;
    }
    this.http.get<UserGetDto>(`${environment.API_URL}/user/me`, { withCredentials: true })
      .subscribe({
        next: (profile) => {
          this.userProfile.next(profile);
          this.setLoggedIn(true);
        },
        error: () => {
          this.userProfile.next(null);
          this.setLoggedIn(false);
        }
      });
  }

  reloadProfile() {
    this.http.get<UserGetDto>(`${environment.API_URL}/user/me`, { withCredentials: true })
      .subscribe({
        next: (profile) => {
          this.userProfile.next(profile);
          this.setLoggedIn(true);
        },
        error: () => {
          this.userProfile.next(null);
          this.setLoggedIn(false);
        }
      });
  }
}
