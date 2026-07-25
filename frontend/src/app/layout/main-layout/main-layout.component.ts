import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MenubarModule,
    ButtonModule,
    MenuModule,
    BadgeModule
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex items-center gap-8">
              <a routerLink="/dashboard" class="text-xl font-bold text-primary">
                TaskManager
              </a>
              <nav class="hidden md:flex space-x-4">
                <a routerLink="/dashboard" routerLinkActive="bg-primary text-white" class="px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </a>
                <a routerLink="/projects" routerLinkActive="bg-primary text-white" class="px-3 py-2 rounded-md text-sm font-medium">
                  Projects
                </a>
              </nav>
            </div>
            <div class="flex items-center gap-4">
              <a routerLink="/notifications" class="relative">
                <i class="pi pi-bell text-gray-600 text-xl"></i>
              </a>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{ authService.user()?.fullName }}</span>
                <button
                  pButton
                  icon="pi pi-sign-out"
                  class="p-button-text p-button-rounded"
                  (click)="logout()"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
