import { Routes } from '@angular/router';
import {profileOwnerGuard} from './core/guards/profile-owner.guard';
import {authGuard} from './core/guards/auth.guard';
import {leagueOwnerGuard} from './core/guards/league-owner.guard';
import {adminGuard} from './core/guards/admin.guard';

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
        canActivate: [authGuard],
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
            canActivate: [leagueOwnerGuard],
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/leagues/league-manage/league-manage.component').then(
                (m) => m.LeagueManageComponent
              );
            }
          },
          {
            path: 'find',
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/leagues/league-find/league-find.component').then(
                (m) => m.LeagueFindComponent
              );
            }
          },
          {
            path: ':leagueId/view',
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/leagues/league-view/league-view.component').then(
                (m) => m.LeagueViewComponent
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
        canActivate: [authGuard],
        children: [
          {
            path: "",
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/ask-ai/ask-ai-landing-page/ask-ai-landing-page.component').then(
                (m) => m.AskAiLandingPageComponent
              );
            },
          },
          {
            path: 'prediction/:id',
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/ask-ai/prediction-detail/prediction-detail.component').then(
                (m) => m.PredictionDetailComponent
              );
            }
          },
          {
            path: 'create/qualifying',
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/ask-ai/create-qualifying/create-qualifying.component').then(
                (m) => m.CreateQualifyingComponent
              );
            }
          },
          {
            path: 'create/main',
            pathMatch: 'full',
            loadComponent: async () => {
              return import('./routing/fantasy/ask-ai/create-main-race/create-main-race.component').then(
                (m) => m.CreateMainRaceComponent
              );
            }
          }
        ]
      },
      {
        path: '',
        redirectTo: 'status',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'statistic',
    loadComponent: async () => {
      return import('./shared/statistic-container/statistic-container.component').then(
        (m) => m.StatisticContainerComponent
      );
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'drivers'
      },
      {
        path: 'races',
        loadComponent: async () => {
          return import('./routing/statistic/race-statistic/race-statistic.component').then(
            (m) => m.RaceStatisticComponent
          );
        }
      },
      {
        path: 'drivers',
        loadComponent: async () => {
          return import('./routing/statistic/driver-statistic/driver-statistic.component').then(
            (m) => m.DriverStatisticComponent
          );
        }
      },
      {
        path: 'constructors',
        loadComponent: async () => {
          return import('./routing/statistic/constructor-statistic/constructor-statistic.component').then(
            (m) => m.ConstructorStatisticComponent
          );
        }
      },
      {
        path: 'players',
        loadComponent: async () => {
          return import('./routing/statistic/player-statistic/player-statistic.component').then(
            (m) => m.PlayerStatisticComponent
          );
        }
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: async () => {
      return import('./shared/admin-container/admin-container.component').then(
        (m) => m.AdminContainerComponent
      );
    },
    children: [
      {
        path: 'imgs',
        loadComponent: async () => {
          return import('./routing/admin/imgs-update/update-img-sidebar/update-img-sidebar.component').then(
            (m) => m.UpdateImgSidebarComponent
          );
        },
        children: [
          {
            path: 'drivers',
            loadComponent: async () => {
              return import('./routing/admin/imgs-update/driver-img-manager/driver-img-manager.component').then(m => m.DriverImgManagerComponent);
            }
          },
          {
            path: 'circuits',
            loadComponent: async () => {
              return import('./routing/admin/imgs-update/circuit-img-manager/circuit-img-manager.component').then(m => m.CircuitImgManagerComponent);
            }
          },
          {
            path: 'constructors',
            loadComponent: async () => {
              return import('./routing/admin/imgs-update/constructor-img-manager/constructor-img-manager.component').then(m => m.ConstructorImgManagerComponent);
            }
          },
          {
            path: 'powerups',
            loadComponent: async () => {
              return import('./routing/admin/imgs-update/powerup-img-manager/powerup-img-manager.component').then(m => m.PowerupImgManagerComponent);
            }
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'drivers'
          }
        ]
      },
      {
        path: 'public-league',
        loadComponent: async () => {
          return import('./routing/admin/public-league/public-league-sidebar/public-league-sidebar.component').then(
            (m) => m.PublicLeagueSidebarComponent
          );
        },
        children: [
          {
            path: 'manage',
            loadComponent: async () => {
              return import('./routing/admin/public-league/public-league-manager/public-league-manager.component').then(m => m.PublicLeagueManagerComponent);
            }
          },
          {
            path: 'create',
            loadComponent: async () => {
              return import('./routing/admin/public-league/public-league-create/public-league-create.component').then(m => m.PublicLeagueCreateComponent);
            }
          }
        ]
      },
      {
        path: 'game-season',
        loadComponent: async () => {
          return import('./routing/admin/game-season/game-season-sidebar/game-season-sidebar.component').then(
            (m) => m.GameSeasonSidebarComponent
          );
        },
        children: [
          {
            path: 'season',
            loadComponent: async () => {
              return import('./routing/admin/game-season/season-manager/season-manager.component').then(m => m.SeasonManagerComponent);
            }
          },
          {
            path: 'pickable-items',
            loadComponent: async () => {
              return import('./routing/admin/game-season/pickable-items-manager/pickable-items-manager.component').then(m => m.PickableItemsManagerComponent);
            }
          }
        ]
      },
      {
        path: 'user',
        loadComponent: async () => {
          return import('./routing/admin/users-update/user-sidebar/user-sidebar.component').then(
            (m) => m.UserSidebarComponent
          );
        },
        children: [
          {
            path: 'roles',
            loadComponent: async () => {
              return import('./routing/admin/users-update/user-role-manager/user-role-manager.component').then(m => m.UserRoleManagerComponent);
            }
          }
        ]
      },
    ]
  },
  {
    path: 'not-found',
    pathMatch: 'full',
    loadComponent: async () => {
      return import('./routing/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      );
    },
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
]
