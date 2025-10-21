import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import {NotificationGetDto} from './dtos/notification.get.dto';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private hubConnection?: signalR.HubConnection;
  private currentUserId: number | null = null;

  private notificationsSubject = new BehaviorSubject<NotificationGetDto[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService : AuthService,
    private ngZone: NgZone) {
    // react to login/logout and keep currentUserId
    this.authService.userProfile$.subscribe(user => {
      const uid = user?.id ?? null;
      if (uid) {
        this.currentUserId = uid;
        this.connectHub().catch(() => { /* ignore connect error for now */ });
        this.fetchUnreadNotifications().subscribe({ error: () => { /* ignore */ } });
      } else {
        this.currentUserId = null;
        this.disconnectHub();
        this.notificationsSubject.next([]);
        this.unreadCountSubject.next(0);
      }
    });
  }

  // fetch unread from backend (uses current user if userId not provided)
  fetchUnreadNotifications(userId?: number): Observable<NotificationGetDto[]> {
    const uid = userId ?? this.currentUserId;
    if (!uid) {
      return of([]);
    }

    return this.http.get<NotificationGetDto[]>(
      `${environment.API_URL}/notification/user/${uid}/unread`,
      { withCredentials: true }
    ).pipe(map(list => {
      this.notificationsSubject.next(list);
      this.unreadCountSubject.next(list.length);
      return list;
    }));
  }

  // mark single notification read (uses current user)
  markAsRead(id: number): Observable<NotificationGetDto> {
    const uid = this.currentUserId;
    if (!uid) {
      return throwError(() => new Error('No current user'));
    }

    // optimistic update locally
    const current = this.notificationsSubject.value;
    const remaining = current.filter(n => n.id !== id);
    this.notificationsSubject.next(remaining);
    this.unreadCountSubject.next(remaining.length);

    return this.http.patch<NotificationGetDto>(
      `${environment.API_URL}/user/${uid}/notification/${id}/read`,
      {},
      { withCredentials: true }
    );
  }

  // mark all read (uses current user)
  markAllRead(): Observable<void> {
    const uid = this.currentUserId;
    if (!uid) {
      return throwError(() => new Error('No current user'));
    }

    // optimistic local update
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);

    return this.http.patch<void>(
      `${environment.API_URL}/user/${uid}/notifications/mark-all-read`,
      {},
      { withCredentials: true }
    );
  }

  // SignalR connection lifecycle
  async connectHub(): Promise<void> {
    if (!this.currentUserId) return;
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.API_URL}/hub/notification`,
        { withCredentials: true,
          skipNegotiation: true,  // skipNegotiation as we specify WebSockets
          transport: signalR.HttpTransportType.WebSockets  // force WebSocket transport
        })
      .withAutomaticReconnect()
      .build();

    // ensure updates run inside Angular zone so async pipes / change detection update UI
    this.hubConnection.on('ReceiveNotification', (payload: NotificationGetDto) => {
      this.ngZone.run(() => {
        // defensive check; hub can already scope per user server-side
        if (this.currentUserId && payload.userId === this.currentUserId) {
          const list = [payload, ...this.notificationsSubject.value];
          this.notificationsSubject.next(list);
          this.unreadCountSubject.next(list.filter(n => !n.readAt).length);
        }
      });
    });

    await this.hubConnection.start();
  }

  async disconnectHub(): Promise<void> {
    try {
      await this.hubConnection?.stop();
    } catch {
      // ignore
    } finally {
      this.hubConnection = undefined;
    }
  }
}
