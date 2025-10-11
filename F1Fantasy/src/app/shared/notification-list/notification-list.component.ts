import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, DatePipe, NgIf} from '@angular/common';
import { NotificationService } from '../../core/services/notification/notification.service';
import { NotificationGetDto } from '../../core/services/notification/dtos/notification.get.dto';
import { AsyncPipe, NgForOf } from '@angular/common';
import {AuthService} from '../../core/services/auth/auth.service';
import {Observable, Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, DatePipe, AsyncPipe, NgForOf, NgIf],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications$!: Observable<NotificationGetDto[]>;
  unreadCount$!: Observable<number>;
  currentUserId: number | null = null;
  loadingMarkAll = false;
  private subs = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.notifications$ = this.notificationService.notifications$;
    this.unreadCount$ = this.notificationService.unreadCount$;

    this.subs.add(
      this.authService.userProfile$.subscribe(u => {
        this.currentUserId = u?.id ?? null;
      })
    );

    // Ensure unread fetched if component mounted after login
    this.notificationService.fetchUnreadNotifications().subscribe({ error: () => {} });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  markRead(n: NotificationGetDto, navigate = false) {
    if (n.readAt) {
      if (navigate) {
        const url = `${environment.API_URL}/notification/${n.id}`;
        window.open(url, '_blank');
      }
      return;
    }

    this.notificationService.markAsRead(n.id).subscribe({
      next: () => {
        if (navigate) {
          const url = `${environment.API_URL}/notification/${n.id}`;
          window.open(url, '_blank');
        }
      },
      error: () => {
        // on error re-fetch to keep client in sync
        this.notificationService.fetchUnreadNotifications().subscribe();
      }
    });
  }


  markAll() {
    if (!this.currentUserId) return;
    this.loadingMarkAll = true;
    this.notificationService.markAllRead().subscribe({
      next: () => {
        this.loadingMarkAll = false;
      },
      error: () => {
        this.loadingMarkAll = false;
        this.notificationService.fetchUnreadNotifications().subscribe();
      }
    });
  }

  open(n: NotificationGetDto) {
    // mark read then navigate if link present
    this.markRead(n, true);
  }

  trackById(_: number, item: NotificationGetDto) {
    return item.id;
  }
}
