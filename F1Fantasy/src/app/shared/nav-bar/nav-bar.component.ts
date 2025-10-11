import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {NavigationStart, Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import {AsyncPipe, NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {UserGetDto} from '../../core/services/user/dtos/user.get.dto';
import {filter, Observable, Subscription} from 'rxjs';
import {NotificationListComponent} from '../notification-list/notification-list.component';
import {NotificationService} from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf, NotificationListComponent, NgStyle, NgOptimizedImage],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnDestroy {
  isLoggedIn$: Observable<boolean>;
  userProfile$: Observable<UserGetDto | null>;
  unreadCount$: Observable<number>;
  showNotif = false;

  private subs = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userProfile$ = this.authService.userProfile$;
    this.unreadCount$ = this.notificationService.unreadCount$;

    // Connect / fetch notifications on login, disconnect on logout
    this.subs.add(
      this.authService.isLoggedIn$.subscribe(async (loggedIn) => {
        if (loggedIn) {
          // connect SignalR and fetch unread (errors ignored; service will retry)
          // await this.notificationService.connectHub().catch(() => {});
          this.notificationService.fetchUnreadNotifications().subscribe({ error: () => {} });
        } else {
          await this.notificationService.disconnectHub().catch(() => {});
          this.showNotif = false;
        }
      })
    );

    // Close notification dropdown on navigation
    this.subs.add(
      this.router.events
        .pipe(filter((e): e is NavigationStart => e instanceof NavigationStart))
        .subscribe(() => {
          this.showNotif = false;
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    // best-effort disconnect
    this.notificationService.disconnectHub().catch(() => {});
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.authService.loadProfile();
      this.router.navigateByUrl('/');
    });
  }

  @ViewChild('notifBtn', { read: ElementRef }) private notifBtn?: ElementRef<HTMLButtonElement>;
  notifDropdownStyle: Record<string, string> = {};

  // replace inline toggle usage with this method
  toggleNotif(): void {
    this.showNotif = !this.showNotif;

    if (this.showNotif && this.notifBtn?.nativeElement) {
      const rect = this.notifBtn.nativeElement.getBoundingClientRect();
      const DROPDOWN_WIDTH = 340; // match .notifications-panel width or override
      const MARGIN = 8;

      // compute left clamped to viewport
      const availableLeft = Math.min(Math.max(rect.left, MARGIN), window.innerWidth - DROPDOWN_WIDTH - MARGIN);
      const top = rect.bottom + 8; // small gap under button

      this.notifDropdownStyle = {
        position: 'fixed',
        left: `${availableLeft}px`,
        top: `${top}px`,
        width: `${DROPDOWN_WIDTH}px`,
        zIndex: '1400'
      };
    } else {
      this.notifDropdownStyle = {};
    }
  }
}
