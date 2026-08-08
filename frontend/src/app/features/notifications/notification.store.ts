import { Injectable, signal, computed, inject } from '@angular/core';
import { Notification } from '../../core/models/notification.model';
import { NotificationService } from './notification.service';
import { TranslationService } from '../../core/i18n/translation.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationStore {
  private notificationService: NotificationService;
  private translationService = inject(TranslationService);

  // State
  private _notifications = signal<Notification[]>([]);
  private _unreadCount = signal<number>(0);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Computed
  notifications = this._notifications.asReadonly();
  unreadCount = this._unreadCount.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  unreadNotifications = computed(() =>
    this._notifications().filter(n => !n.isRead)
  );

  readNotifications = computed(() =>
    this._notifications().filter(n => n.isRead)
  );

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  loadNotifications(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.notificationService.getNotifications().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this._notifications.set(response.data);
        } else {
          this._error.set(response.errors?.[0] || this.translationService.translate('notifications.loadFailed'));
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set(this.translationService.translate('notifications.loadFailed'));
        this._isLoading.set(false);
      }
    });
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (response) => {
        if (response.success && response.data !== undefined) {
          this._unreadCount.set(response.data);
        }
      },
      error: (error) => {
        console.error('Failed to load unread count', error);
      }
    });
  }

  markAsRead(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.notificationService.markAsRead(id).subscribe({
        next: (response) => {
          if (response.success) {
            this._notifications.update(notifications =>
              notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
              )
            );
            this._unreadCount.update(count => Math.max(0, count - 1));
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('notifications.markFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('notifications.markFailed'));
          resolve(false);
        }
      });
    });
  }

  markAllAsRead(): Promise<boolean> {
    return new Promise((resolve) => {
      this.notificationService.markAllAsRead().subscribe({
        next: (response) => {
          if (response.success) {
            this._notifications.update(notifications =>
              notifications.map(n => ({ ...n, isRead: true }))
            );
            this._unreadCount.set(0);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('notifications.markAllFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('notifications.markAllFailed'));
          resolve(false);
        }
      });
    });
  }

  deleteNotification(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.notificationService.deleteNotification(id).subscribe({
        next: (response) => {
          if (response.success) {
            const notification = this._notifications().find(n => n.id === id);
            this._notifications.update(notifications =>
              notifications.filter(n => n.id !== id)
            );
            if (notification && !notification.isRead) {
              this._unreadCount.update(count => Math.max(0, count - 1));
            }
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('notifications.deleteFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('notifications.deleteFailed'));
          resolve(false);
        }
      });
    });
  }

  clearError(): void {
    this._error.set(null);
  }
}
