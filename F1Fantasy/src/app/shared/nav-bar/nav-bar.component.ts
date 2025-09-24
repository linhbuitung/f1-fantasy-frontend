import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import {UserGetDto} from '../../core/services/user/dtos/user.get.dto';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  isLoggedIn$: Observable<boolean>;
  userProfile$: Observable<UserGetDto | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userProfile$ = this.authService.userProfile$;
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.authService.loadProfile();
      this.router.navigateByUrl('/');
    });
  }
}
