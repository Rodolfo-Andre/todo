import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    AvatarModule,
    DividerModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <div class="space-y-6">
      <h1 class="text-2xl font-bold">My Profile</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <p-card styleClass="lg:col-span-1">
          <ng-template pTemplate="header">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-24 rounded-t-lg"></div>
          </ng-template>

          <div class="flex flex-col items-center -mt-12">
            <p-avatar
              [label]="getInitials(user()?.fullName || '')"
              styleClass="bg-blue-500 text-2xl"
              shape="circle"
              [style]="{ width: '80px', height: '80px', fontSize: '1.5rem' }"
            ></p-avatar>
            <h2 class="mt-4 text-xl font-semibold">{{ user()?.fullName }}</h2>
            <p class="text-gray-500">{{ user()?.email }}</p>

            <div class="flex gap-2 mt-4">
              @for (role of user()?.roles; track role) {
                <p-tag [value]="role" [severity]="getRoleSeverity(role)"></p-tag>
              }
            </div>

            <div class="mt-4 text-center">
              <p class="text-sm text-gray-500">Member since</p>
              <p class="font-medium">{{ user()?.createdAt | date:'mediumDate' }}</p>
            </div>
          </div>
        </p-card>

        <!-- Profile Form -->
        <p-card styleClass="lg:col-span-2">
          <ng-template pTemplate="header">
            <div class="px-4 py-3 border-b">
              <h2 class="text-lg font-semibold">Profile Information</h2>
            </div>
          </ng-template>

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label for="fullName" class="font-medium text-sm">Full Name</label>
                <input pInputText id="fullName" formControlName="fullName" class="w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label for="email" class="font-medium text-sm">Email</label>
                <input pInputText id="email" formControlName="email" type="email" class="w-full" />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="avatarUrl" class="font-medium text-sm">Avatar URL</label>
              <input pInputText id="avatarUrl" formControlName="avatarUrl" class="w-full" placeholder="https://example.com/avatar.jpg" />
            </div>

            <div class="flex justify-end">
              <p-button label="Save Changes" type="submit" [loading]="isSaving" [disabled]="profileForm.invalid"></p-button>
            </div>
          </form>
        </p-card>
      </div>

      <!-- Account Info -->
      <p-card>
        <ng-template pTemplate="header">
          <div class="px-4 py-3 border-b">
            <h2 class="text-lg font-semibold">Account Information</h2>
          </div>
        </ng-template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-gray-500 mb-1">Username</p>
            <p class="font-medium">{{ user()?.userName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Account Status</p>
            <p-tag [value]="user()?.isActive ? 'Active' : 'Inactive'" [severity]="user()?.isActive ? 'success' : 'danger'"></p-tag>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">User ID</p>
            <p class="font-medium text-sm text-gray-600">{{ user()?.id }}</p>
          </div>
        </div>
      </p-card>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  profileForm: FormGroup;
  isSaving = false;

  user = this.authService.user;

  constructor() {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      avatarUrl: ['']
    });
  }

  ngOnInit(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.profileForm.patchValue({
        fullName: currentUser.fullName,
        email: currentUser.email,
        avatarUrl: currentUser.avatarUrl || ''
      });
    }
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

  onSubmit(): void {
    if (this.profileForm.invalid || !this.user()) return;

    this.isSaving = true;
    this.userService.updateUser(this.user()!.id, this.profileForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully'
          });
          // Refresh user data
          this.authService.getCurrentUser().subscribe();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.errors?.[0] || 'Failed to update profile'
          });
        }
        this.isSaving = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update profile'
        });
        this.isSaving = false;
      }
    });
  }
}
