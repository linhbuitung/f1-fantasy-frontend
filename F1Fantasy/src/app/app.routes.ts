import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => {
      return import('./routing/home/home.component').then(
        (m) => m.HomeComponent
      );
    },
  }]

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