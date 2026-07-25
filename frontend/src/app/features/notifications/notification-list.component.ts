import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Notifications</h1>
        <p-button label="Mark All as Read" icon="pi pi-check" styleClass="p-button-text"></p-button>
      </div>

      <p-card>
        <p class="text-gray-500">No notifications to display.</p>
      </p-card>
    </div>
  `
})
export class NotificationListComponent {}
