import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NotificationStore } from './notification.store';
import { Notification } from '../../core/models/notification.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="space-y-6">
      <div class="page-header">
        <div>
          <h1 class="text-2xl font-bold">{{ t('notifications.title') }}</h1>
          @if (notificationStore.unreadCount() > 0) {
            <p class="text-sm text-gray-500">{{ notificationStore.unreadCount() }} {{ t('notifications.unread') }}</p>
          }
        </div>
        <div class="page-actions">
          <p-button
            [label]="t('notifications.markAllRead')"
            icon="pi pi-check"
            styleClass="p-button-text"
            (onClick)="markAllAsRead()"
            [disabled]="notificationStore.unreadCount() === 0"
          ></p-button>
          <p-button
            [label]="t('common.refresh')"
            icon="pi pi-refresh"
            styleClass="p-button-outlined"
            (onClick)="loadNotifications()"
          ></p-button>
        </div>
      </div>

      @if (notificationStore.isLoading()) {
        <div class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
          <p class="mt-2 text-gray-500">{{ t('common.loading') }}</p>
        </div>
      } @else if (notificationStore.notifications().length > 0) {
        <!-- Unread Notifications -->
        @if (notificationStore.unreadNotifications().length > 0) {
          <div>
            <h2 class="text-lg font-semibold mb-3">{{ t('notifications.new') }}</h2>
            <div class="flex flex-col gap-3">
              @for (notification of notificationStore.unreadNotifications(); track notification.id) {
                <div
                  class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                  (click)="markAsRead(notification)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                           [class]="getTypeIconClass(notification.type)">
                        <i [class]="getTypeIcon(notification.type)"></i>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900">{{ notification.title }}</h3>
                        <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                        <p class="text-xs text-gray-400 mt-2">{{ notification.createdAt | date:'medium' }}</p>
                      </div>
                    </div>
                    <button
                      pButton
                      icon="pi pi-trash"
                      class="p-button-text p-button-sm p-button-danger"
                      (click)="deleteNotification(notification, $event)"
                    ></button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Read Notifications -->
        @if (notificationStore.readNotifications().length > 0) {
          <div>
            <h2 class="text-lg font-semibold mb-3">{{ t('notifications.earlier') }}</h2>
            <div class="flex flex-col gap-3">
              @for (notification of notificationStore.readNotifications(); track notification.id) {
                <div
                  class="p-4 bg-gray-50 border-l-4 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 text-gray-500">
                        <i [class]="getTypeIcon(notification.type)"></i>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-700">{{ notification.title }}</h3>
                        <p class="text-sm text-gray-500 mt-1">{{ notification.message }}</p>
                        <p class="text-xs text-gray-400 mt-2">{{ notification.createdAt | date:'medium' }}</p>
                      </div>
                    </div>
                    <button
                      pButton
                      icon="pi pi-trash"
                      class="p-button-text p-button-sm p-button-danger"
                      (click)="deleteNotification(notification, $event)"
                    ></button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <p-card>
          <div class="text-center py-8">
            <i class="pi pi-bell-slash text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500">{{ t('notifications.noNotifications') }}</p>
          </div>
        </p-card>
      }
    </div>
  `
})
export class NotificationListComponent implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private translationService = inject(TranslationService);

  notificationStore = inject(NotificationStore);

  t = this.translationService.translate.bind(this.translationService);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationStore.loadNotifications();
    this.notificationStore.loadUnreadCount();
  }

  async markAsRead(notification: Notification): Promise<void> {
    if (!notification.isRead) {
      await this.notificationStore.markAsRead(notification.id);
    }
  }

  async markAllAsRead(): Promise<void> {
    const success = await this.notificationStore.markAllAsRead();
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: this.t('common.success'),
        detail: this.t('notifications.allMarkedAsRead')
      });
    }
  }

  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: this.t('notifications.confirmDelete'),
      header: this.t('common.confirm'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        const success = await this.notificationStore.deleteNotification(notification.id);
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: this.t('common.success'),
            detail: this.t('notifications.deleted')
          });
        }
      }
    });
  }

  getTypeIcon(type: number): string {
    const icons: Record<number, string> = {
      0: 'pi pi-user-plus',      // TaskAssigned
      1: 'pi pi-pencil',         // TaskUpdated
      2: 'pi pi-sync',           // TaskStatusChanged
      3: 'pi pi-comments',       // CommentAdded
      4: 'pi pi-folder-open'     // ProjectUpdated
    };
    return icons[type] || 'pi pi-bell';
  }

  getTypeIconClass(type: number): string {
    const classes: Record<number, string> = {
      0: 'bg-blue-100 text-blue-600',    // TaskAssigned
      1: 'bg-yellow-100 text-yellow-600', // TaskUpdated
      2: 'bg-purple-100 text-purple-600', // TaskStatusChanged
      3: 'bg-green-100 text-green-600',   // CommentAdded
      4: 'bg-orange-100 text-orange-600'  // ProjectUpdated
    };
    return classes[type] || 'bg-gray-100 text-gray-600';
  }
}
