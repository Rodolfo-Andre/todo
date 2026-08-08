import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from './user.service';
import { User } from '../../core/models/user.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">{{ t('users.title') }}</h1>
      </div>

      <p-card>
        <p-table [value]="users" [tableStyle]="{ 'min-width': '60rem' }" [loading]="isLoading">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ t('users.fullName') }}</th>
              <th>{{ t('users.email') }}</th>
              <th>{{ t('users.roles') }}</th>
              <th>{{ t('users.status') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td>
                <div class="flex items-center gap-3">
                  <p-avatar [label]="getInitials(user.fullName)" styleClass="mr-2" shape="circle"></p-avatar>
                  <span>{{ user.fullName }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                @for (role of user.roles; track role) {
                  <p-tag [value]="role" [severity]="getRoleSeverity(role)" class="mr-1"></p-tag>
                }
              </td>
              <td>
                <p-tag [value]="user.isActive ? t('users.active') : t('users.inactive')" [severity]="user.isActive ? 'success' : 'danger'"></p-tag>
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button icon="pi pi-pencil" styleClass="p-button-text p-button-rounded" [routerLink]="['/admin/users', user.id]"></p-button>
                  <p-button icon="pi pi-trash" styleClass="p-button-text p-button-rounded p-button-danger" (onClick)="confirmDelete(user)"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center py-4">
                <p class="text-gray-500">{{ t('users.noUsers') }}</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private translationService = inject(TranslationService);
  t = this.translationService.translate.bind(this.translationService);

  users: User[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.t('common.error'),
          detail: this.t('users.loadFailed')
        });
        this.isLoading = false;
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getRoleSeverity(role: string): string {
    switch (role) {
      case 'Admin': return 'danger';
      case 'ProjectManager': return 'warning';
      case 'Developer': return 'info';
      case 'Viewer': return 'secondary';
      default: return 'secondary';
    }
  }

  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: this.t('users.confirmDelete', { name: user.fullName }),
      header: this.t('common.confirm'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: this.t('common.success'),
            detail: this.t('users.userDeleted')
          });
          this.loadUsers();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.t('common.error'),
            detail: response.errors?.[0] || this.t('users.deleteFailed')
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.t('common.error'),
          detail: this.t('users.deleteFailed')
        });
      }
    });
  }
}
