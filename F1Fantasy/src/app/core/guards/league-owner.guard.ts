import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { LeagueService } from '../services/leagues/league.service';
import { map, switchMap } from 'rxjs/operators';

export const leagueOwnerGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const leagueService = inject(LeagueService);
  const router = inject(Router);
  const leagueId = Number(route.paramMap.get('leagueId'));

  return authService.userProfile$.pipe(
    switchMap(user => {
      if (!user) {
        router.navigate(['/login']);
        return [false];
      }
      return leagueService.getLeagueWithPlayersByIdPaged(leagueId).pipe(
        map(league => {
          if (league.owner.id === user.id) {
            return true;
          }
          router.navigate(['/fantasy/leagues']);
          return false;
        })
      );
    })
  );
};
