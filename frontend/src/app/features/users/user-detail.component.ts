import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { UserService } from './user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    InputSwitchModule,
    ToastModule,
    MessageModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Edit User</h1>
        <p-button label="Back to Users" icon="pi pi-arrow-left" styleClass="p-button-text" routerLink="/admin/users"></p-button>
      </div>

      @if (isLoading) {
        <p-card>
          <div class="text-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl"></i>
            <p class="mt-2 text-gray-500">Loading user...</p>
          </div>
        </p-card>
      } @else if (user) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- User Info -->
          <p-card styleClass="lg:col-span-2">
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">User Information</h2>
              </div>
            </ng-template>

            <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label for="fullName" class="font-medium">Full Name</label>
                  <input pInputText id="fullName" formControlName="fullName" class="w-full" />
                </div>

                <div class="flex flex-col gap-2">
                  <label for="email" class="font-medium">Email</label>
                  <input pInputText id="email" formControlName="email" type="email" class="w-full" />
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label for="avatarUrl" class="font-medium">Avatar URL</label>
                <input pInputText id="avatarUrl" formControlName="avatarUrl" class="w-full" />
              </div>

              <div class="flex items-center gap-2">
                <p-inputSwitch formControlName="isActive" inputId="isActive"></p-inputSwitch>
                <label for="isActive" class="font-medium">Active</label>
              </div>

              <div class="flex justify-end gap-2">
                <p-button label="Cancel" styleClass="p-button-text" routerLink="/admin/users"></p-button>
                <p-button label="Save" type="submit" [loading]="isSaving" [disabled]="userForm.invalid"></p-button>
              </div>
            </form>
          </p-card>

          <!-- Role Management -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">Role</h2>
              </div>
            </ng-template>

            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-medium">Current Role</label>
                <p-select
                  [options]="roles"
                  [(ngModel)]="selectedRole"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select a role"
                  styleClass="w-full"
                ></p-select>
              </div>

              <p-button label="Change Role" (onClick)="changeRole()" [loading]="isChangingRole" styleClass="w-full"></p-button>
            </div>
          </p-card>
        </div>
      } @else {
        <p-card>
          <div class="text-center py-8">
            <p class="text-gray-500">User not found.</p>
          </div>
        </p-card>
      }
    </div>
  `
})
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  user: User | null = null;
  userForm: FormGroup;
  isLoading = false;
  isSaving = false;
  isChangingRole = false;
  selectedRole = '';

  roles = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Project Manager', value: 'ProjectManager' },
    { label: 'Developer', value: 'Developer' },
    { label: 'Viewer', value: 'Viewer' }
  ];

  constructor() {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      avatarUrl: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(id);
    }
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.user = response.data;
          this.userForm.patchValue({
            fullName: this.user.fullName,
            email: this.user.email,
            avatarUrl: this.user.avatarUrl || '',
            isActive: this.user.isActive
          });
          this.selectedRole = this.user.roles[0] || '';
        }
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user'
        });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.user) return;

    this.isSaving = true;
    this.userService.updateUser(this.user.id, this.userForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully'
          });
          this.loadUser(this.user!.id);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.errors?.[0] || 'Failed to update user'
          });
        }
        this.isSaving = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user'
        });
        this.isSaving = false;
      }
    });
  }

  changeRole(): void {
    if (!this.user || !this.selectedRole) return;

    this.isChangingRole = true;
    this.userService.changeRole(this.user.id, { role: this.selectedRole }).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role changed successfully'
          });
          this.loadUser(this.user!.id);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.errors?.[0] || 'Failed to change role'
          });
        }
        this.isChangingRole = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to change role'
        });
        this.isChangingRole = false;
      }
    });
  }
}
