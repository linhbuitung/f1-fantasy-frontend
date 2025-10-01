import { Routes } from '@angular/router';
import {profileOwnerGuard} from './core/guards/profile-owner.guard';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => {
      return import('./routing/home/home.component').then(
        (m) => m.HomeComponent
      );
    },
  },
  {
    path: 'about',
    pathMatch: 'full',
    loadComponent: async () => {
      return import('./routing/about/about.component').then(
        (m) => m.AboutComponent
      );
    },
  },
  {
    path: 'register',
    pathMatch: 'full',
    loadComponent: async () => {
      return import('./routing/auth/register/register.component').then(
        (m) => m.RegisterComponent
      );
    },
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: async () => {
      return import('./routing/auth/login/login.component').then(
        (m) => m.LoginComponent
      );
    },
  },
  {
    path: 'profile/:id',
    pathMatch: 'full',
    loadComponent: async () => {
      return import('./routing/profile/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      );
    },
  },
  {
    path: 'profile/:id/reset-password',
    pathMatch: 'full',
    loadComponent: async () => {
      return import('./routing/profile/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      );
    },
  },
  {
    path: 'profile/:id/edit',
    canActivate: [profileOwnerGuard],
    pathMatch: 'full',
    loadComponent: async () => {
      return import('./routing/profile/edit-user/edit-user.component').then(
        (m) => m.EditUserComponent
      );
    },
  },
  {
    path: 'fantasy',
    canActivate: [authGuard],
    children: [
      {
        path: 'status',
        pathMatch: 'full',
        loadComponent: async () => {
          return import('./routing/fantasy/status/status.component').then(
            (m) => m.StatusComponent
          );
        },
      },
      {
        path: 'lineup',
        pathMatch: 'full',
        loadComponent: async () => {
          return import('./routing/fantasy/lineup/lineup.component').then(
            (m) => m.LineupComponent
          );
        },
      },
      {
        path: 'transfers',
        pathMatch: 'full',
        loadComponent: async () => {
          return import('./routing/fantasy/transfers/transfers.component').then(
            (m) => m.TransfersComponent
          );
        },
      },
      {
        path: 'leagues',
        children: [
          {
            path: "",
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/leagues/leagues-landing-page/leagues-landing-page.component').then(
                (m) => m.LeaguesLandingPageComponent
              );
            }
          },
          {
            path: "create",
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/leagues/league-create/league-create.component').then(
                (m) => m.LeagueCreateComponent
              );
            }
          },
          {
            path: ':leagueId/manage',
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/leagues/league-manage/league-manage.component').then(
                (m) => m.LeagueManageComponent
              );
            }
          }
        ]
      },
      {
        path: 'how-to-play',
        pathMatch: 'full',
        loadComponent: async () => {
          return import('./routing/fantasy/how-to-play/how-to-play.component').then(
            (m) => m.HowToPlayComponent
          );
        },
      },
      {
        path: 'rules',
        pathMatch: 'full',
        loadComponent: async () => {
          return import('./routing/fantasy/rules/rules.component').then(
            (m) => m.RulesComponent
          );
        },
      },
      {
        path: 'ask-ai',
        pathMatch: 'full',
        loadComponent: async () => {
          return import('./routing/fantasy/ask-ai/ask-ai.component').then(
            (m) => m.AskAiComponent
          );
        },
      },
      {
        path: '',
        redirectTo: 'status',
        pathMatch: 'full'
      }
    ]
  }
]

// export const routes: Routes = [
//   {
//     path: '',
//     pathMatch: 'full',
//     loadComponent: async () => {
//       return import('./routing/home/home.component').then(
//         (m) => m.HomeComponent
//       );
//     },
//   },
//   {
//     path: 'movie',
//     pathMatch: 'full',
//     loadComponent: async () => {
//       return import('./routing/movie/movie.component').then(
//         (m) => m.MovieComponent
//       );
//     },
//   },
//   {
//     path: 'movie/:id',
//     loadComponent: async () => {
//       return import(
//         './routing/movie-full-route/movie-full-route.component'
//       ).then((m) => m.MovieFullRouteComponent);
//     },
//   },
//   {
//     path: 'screening',
//     pathMatch: 'full',
//     loadComponent: async () => {
//       return import('./routing/screening/screening.component').then(
//         (m) => m.ScreeningComponent
//       );
//     },
//   },
//   {
//     path: 'screening/:id',
//     pathMatch: 'full',
//     loadComponent: async () => {
//       return import(
//         './routing/screening-full-route/screening-full-route.component'
//       ).then((m) => m.ScreeningFullRouteComponent);
//     },
//   },
//   {
//     path: 'room',
//     pathMatch: 'full',
//     loadComponent: async () => {
//       return import('./routing/room/room.component').then(
//         (m) => m.RoomComponent
//       );
//     },
//   },
//   {
//     path: 'room/:id',
//     loadComponent: async () => {
//       return import('./routing/room-full-route/room-full-route.component').then(
//         (m) => m.RoomFullRouteComponent
//       );
//     },
//   },
//   {
//     path: 'add-screening/movie/:movieId',
//     loadComponent: async () => {
//       return import(
//         './routing/add-screening-route/add-screening-route.component'
//       ).then((m) => m.AddScreeningRouteComponent);
//     },
//   },
//   {
//     path: 'add-screening/movie/:movieId/room/:roomId',
//     loadComponent: async () => {
//       return import(
//         './routing/add-screening-pick-date-route/add-screening-pick-date-route.component'
//       ).then((m) => m.AddScreeningPickDateRouteComponent);
//     },
//   },
//   {
//     path: 'add-screening/movie/:movieId/room/:roomId/date/:date',
//     loadComponent: async () => {
//       return import(
//         './routing/add-screening-final-route/add-screening-final-route.component'
//       ).then((m) => m.AddScreeningFinalRouteComponent);
//     }
//   },

//   {
//     path: '**',
//     loadComponent: async () => {
//       return import('./routing/page-not-found/page-not-found.component').then(
//         (m) => m.PageNotFoundComponent
//       );
//     },
//   },
// ];
