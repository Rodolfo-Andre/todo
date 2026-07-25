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

@Component({
  selector: 'app-login',
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
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <p-card styleClass="w-full max-w-md">
        <ng-template pTemplate="header">
          <div class="text-center py-4">
            <h1 class="text-2xl font-bold text-primary">Task Management</h1>
            <p class="text-gray-500">Sign in to your account</p>
          </div>
        </ng-template>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          @if (errorMessage) {
            <p-message severity="error" [text]="errorMessage"></p-message>
          }

          <div class="flex flex-col gap-2">
            <label for="email" class="font-medium">Email</label>
            <input
              pInputText
              id="email"
              formControlName="email"
              type="email"
              placeholder="Enter your email"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-medium">Password</label>
            <p-password
              id="password"
              formControlName="password"
              placeholder="Enter your password"
              [feedback]="false"
              [toggleMask]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
            ></p-password>
          </div>

          <p-button
            type="submit"
            label="Sign In"
            styleClass="w-full"
            [loading]="isLoading()"
            [disabled]="loginForm.invalid"
          ></p-button>

          <div class="text-center">
            <span class="text-gray-500">Don't have an account?</span>
            <a routerLink="/auth/register" class="text-primary ml-1">Sign up</a>
          </div>
        </form>
      </p-card>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = this.authService.isLoading;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.errorMessage = null;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.errors?.[0] || 'Login failed';
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Login failed';
      }
    });
  }
}
