import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs/operators';

export const profileOwnerGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));
  return authService.userProfile$.pipe(
    map(user => {
      if (user && user.id === id) {
        return true;
      }
      router.navigate(['/']); // or a 403 page
      return false;
    })
  );
};
