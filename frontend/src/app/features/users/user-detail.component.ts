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
import { TranslationService } from '../../core/i18n/translation.service';

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
        <h1 class="text-2xl font-bold">{{ t('users.editUser') }}</h1>
        <p-button [label]="t('users.backToUsers')" icon="pi pi-arrow-left" styleClass="p-button-text" routerLink="/admin/users"></p-button>
      </div>

      @if (isLoading) {
        <p-card>
          <div class="text-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl"></i>
            <p class="mt-2 text-gray-500">{{ t('common.loading') }}</p>
          </div>
        </p-card>
      } @else if (user) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- User Info -->
          <p-card styleClass="lg:col-span-2">
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">{{ t('users.userInformation') }}</h2>
              </div>
            </ng-template>

            <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label for="fullName" class="font-medium">{{ t('users.fullName') }}</label>
                  <input pInputText id="fullName" formControlName="fullName" class="w-full" />
                </div>

                <div class="flex flex-col gap-2">
                  <label for="email" class="font-medium">{{ t('users.email') }}</label>
                  <input pInputText id="email" formControlName="email" type="email" class="w-full" />
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label for="avatarUrl" class="font-medium">{{ t('users.avatarUrl') }}</label>
                <input pInputText id="avatarUrl" formControlName="avatarUrl" class="w-full" />
              </div>

              <div class="flex items-center gap-2">
                <p-inputSwitch formControlName="isActive" inputId="isActive"></p-inputSwitch>
                <label for="isActive" class="font-medium">{{ t('users.active') }}</label>
              </div>

              <div class="flex justify-end gap-2">
                <p-button [label]="t('common.cancel')" styleClass="p-button-text" routerLink="/admin/users"></p-button>
                <p-button [label]="t('common.save')" type="submit" [loading]="isSaving" [disabled]="userForm.invalid"></p-button>
              </div>
            </form>
          </p-card>

          <!-- Role Management -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">{{ t('users.role') }}</h2>
              </div>
            </ng-template>

            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-medium">{{ t('users.currentRole') }}</label>
                <p-select
                  [options]="roles"
                  [(ngModel)]="selectedRole"
                  optionLabel="label"
                  optionValue="value"
                  [placeholder]="t('common.select')"
                  styleClass="w-full"
                ></p-select>
              </div>

              <p-button [label]="t('users.changeRole')" (onClick)="changeRole()" [loading]="isChangingRole" styleClass="w-full"></p-button>
            </div>
          </p-card>
        </div>
      } @else {
        <p-card>
          <div class="text-center py-8">
            <p class="text-gray-500">{{ t('users.notFound') }}</p>
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
  private translationService = inject(TranslationService);
  t = this.translationService.translate.bind(this.translationService);

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
          summary: this.t('common.error'),
          detail: this.t('users.loadFailed')
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
            summary: this.t('common.success'),
            detail: this.t('users.userUpdated')
          });
          this.loadUser(this.user!.id);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.t('common.error'),
            detail: response.errors?.[0] || this.t('users.updateFailed')
          });
        }
        this.isSaving = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.t('common.error'),
          detail: this.t('users.updateFailed')
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
            summary: this.t('common.success'),
            detail: this.t('users.roleChanged')
          });
          this.loadUser(this.user!.id);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.t('common.error'),
            detail: response.errors?.[0] || this.t('users.roleChangeFailed')
          });
        }
        this.isChangingRole = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.t('common.error'),
          detail: this.t('users.roleChangeFailed')
        });
        this.isChangingRole = false;
      }
    });
  }
}
