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
import { ProfileService } from './profile.service';

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
              [label]="getInitials(profile()?.fullName || '')"
              styleClass="bg-blue-500 text-2xl"
              shape="circle"
              [style]="{ width: '80px', height: '80px', fontSize: '1.5rem' }"
            ></p-avatar>
            <h2 class="mt-4 text-xl font-semibold">{{ profile()?.fullName }}</h2>
            <p class="text-gray-500">{{ profile()?.email }}</p>

            <div class="flex gap-2 mt-4">
              @for (role of profile()?.roles; track role) {
                <p-tag [value]="role" [severity]="getRoleSeverity(role)"></p-tag>
              }
            </div>

            <div class="mt-4 text-center">
              <p class="text-sm text-gray-500">Member since</p>
              <p class="font-medium">{{ profile()?.createdAt | date:'mediumDate' }}</p>
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

          <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" class="flex flex-col gap-4">
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

      <!-- Change Password -->
      <p-card>
        <ng-template pTemplate="header">
          <div class="px-4 py-3 border-b">
            <h2 class="text-lg font-semibold">Change Password</h2>
          </div>
        </ng-template>

        <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="flex flex-col gap-4 max-w-md">
          <div class="flex flex-col gap-2">
            <label for="currentPassword" class="font-medium text-sm">Current Password</label>
            <input pInputText id="currentPassword" formControlName="currentPassword" type="password" class="w-full" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="newPassword" class="font-medium text-sm">New Password</label>
            <input pInputText id="newPassword" formControlName="newPassword" type="password" class="w-full" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="font-medium text-sm">Confirm New Password</label>
            <input pInputText id="confirmPassword" formControlName="confirmPassword" type="password" class="w-full" />
          </div>

          <div class="flex justify-end">
            <p-button label="Change Password" type="submit" [loading]="isChangingPassword" [disabled]="passwordForm.invalid" severity="warn"></p-button>
          </div>
        </form>
      </p-card>

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
            <p class="font-medium">{{ profile()?.userName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Account Status</p>
            <p-tag [value]="profile()?.isActive ? 'Active' : 'Inactive'" [severity]="profile()?.isActive ? 'success' : 'danger'"></p-tag>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">User ID</p>
            <p class="font-medium text-sm text-gray-600">{{ profile()?.id }}</p>
          </div>
        </div>
      </p-card>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  isSaving = false;
  isChangingPassword = false;

  profile = this.profileService.currentProfile;

  constructor() {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      avatarUrl: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profileForm.patchValue({
            fullName: response.data.fullName,
            email: response.data.email,
            avatarUrl: response.data.avatarUrl || ''
          });
        }
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

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully'
          });
          this.loadProfile();
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

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match'
      });
      return;
    }

    this.isChangingPassword = true;
    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed successfully'
          });
          this.passwordForm.reset();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.errors?.[0] || 'Failed to change password'
          });
        }
        this.isChangingPassword = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to change password'
        });
        this.isChangingPassword = false;
      }
    });
  }
}
