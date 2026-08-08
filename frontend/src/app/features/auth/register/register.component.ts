import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/auth/auth.service';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    MessageModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <p-card styleClass="w-full max-w-md">
        <ng-template pTemplate="header">
          <div class="text-center py-4">
            <h1 class="text-2xl font-bold text-primary">{{ t('common.appName') }}</h1>
            <p class="text-gray-500">{{ t('auth.registerSubtitle') }}</p>
          </div>
        </ng-template>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          @if (errorMessage) {
            <p-message severity="error" [text]="errorMessage"></p-message>
          }

          <div class="flex flex-col gap-2">
            <label for="fullName" class="font-medium">{{ t('auth.fullName') }}</label>
            <input
              pInputText
              id="fullName"
              formControlName="fullName"
              [placeholder]="t('auth.fullNamePlaceholder')"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="userName" class="font-medium">{{ t('auth.userName') }}</label>
            <input
              pInputText
              id="userName"
              formControlName="userName"
              [placeholder]="t('auth.userNamePlaceholder')"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="email" class="font-medium">{{ t('auth.email') }}</label>
            <input
              pInputText
              id="email"
              formControlName="email"
              type="email"
              [placeholder]="t('auth.emailPlaceholder')"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-medium">{{ t('auth.password') }}</label>
            <p-password
              id="password"
              formControlName="password"
              [placeholder]="t('auth.passwordCreatePlaceholder')"
              [toggleMask]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
            ></p-password>
          </div>

          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="font-medium">{{ t('auth.confirmPassword') }}</label>
            <p-password
              id="confirmPassword"
              formControlName="confirmPassword"
              [placeholder]="t('auth.confirmPasswordPlaceholder')"
              [feedback]="false"
              [toggleMask]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
            ></p-password>
          </div>

          <p-button
            type="submit"
            [label]="t('auth.register')"
            styleClass="w-full"
            [loading]="isLoading()"
            [disabled]="registerForm.invalid"
          ></p-button>

          <div class="text-center">
            <span class="text-gray-500">{{ t('auth.hasAccount') }}</span>
            <a routerLink="/auth/login" class="text-primary ml-1">{{ t('auth.login') }}</a>
          </div>
        </form>
      </p-card>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translationService = inject(TranslationService);
  t = this.translationService.translate.bind(this.translationService);

  registerForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = this.authService.isLoading;

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.errorMessage = null;
    const { confirmPassword, ...registerData } = this.registerForm.value;
    this.authService.register(registerData).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.errors?.[0] || this.t('auth.registerFailed');
        }
      },
      error: (error) => {
        this.errorMessage = error.message || this.t('auth.registerFailed');
      }
    });
  }
}
