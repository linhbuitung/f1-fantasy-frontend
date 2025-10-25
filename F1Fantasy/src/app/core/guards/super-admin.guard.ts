import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {map} from 'rxjs/operators';

export const superAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.userProfile$.pipe(
    map(user => {
      if (user?.roles && !user.roles.includes('SuperAdmin')) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
