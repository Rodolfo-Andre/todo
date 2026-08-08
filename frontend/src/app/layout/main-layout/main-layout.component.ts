import { Component, inject, signal, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationStore } from '../../features/notifications/notification.store';
import { TranslationService } from '../../core/i18n/translation.service';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    TooltipModule,
    LanguageSwitcherComponent
  ],
  template: `
    <!-- Mobile Overlay -->
    @if (sidebarOpen()) {
      <div
        class="fixed inset-0 bg-black/50 z-40 md:hidden"
        (click)="closeSidebar()"
      ></div>
    }

    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside
        [class]="sidebarExpanded()
          ? 'w-64 bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out'
          : 'w-20 bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out'"
        [class.fixed]="isMobile()"
        [class.z-50]="isMobile()"
        [class.inset-y-0]="isMobile()"
        [class.left-0]="isMobile()"
        [class.transform]="isMobile()"
        [class.translate-x-0]="isMobile() && sidebarOpen()"
        [class.-translate-x-full]="isMobile() && !sidebarOpen()"
      >
        <!-- Logo -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          <a routerLink="/dashboard" class="flex items-center gap-3 overflow-hidden">
            <i class="pi pi-check-square text-blue-400 text-xl flex-shrink-0"></i>
            @if (sidebarExpanded()) {
              <span class="text-xl font-bold whitespace-nowrap">{{ t('common.appName') }}</span>
            }
          </a>
          <!-- Collapse toggle (desktop) -->
          <button
            pButton
            icon="pi pi-chevron-left"
            class="p-button-rounded p-button-text p-button-plain flex-shrink-0"
            [class.rotate-180]="!sidebarExpanded()"
            [style]="{ display: isMobile() ? 'none' : 'inline-flex' }"
            [pTooltip]="sidebarExpanded() ? t('nav.collapse') : t('nav.expand')"
            tooltipPosition="right"
            (click)="toggleSidebar()"
          ></button>
          <!-- Close button (mobile drawer) -->
          <button
            pButton
            icon="pi pi-times"
            class="p-button-rounded p-button-text p-button-plain flex-shrink-0"
            [style]="{ display: isMobile() ? 'inline-flex' : 'none' }"
            (click)="closeSidebar()"
          ></button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <a routerLink="/dashboard"
             routerLinkActive="bg-slate-700 text-white"
             [pTooltip]="!sidebarExpanded() ? t('nav.dashboard') : ''"
             tooltipPosition="right"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <i class="pi pi-home text-lg flex-shrink-0"></i>
            @if (sidebarExpanded()) {
              <span class="whitespace-nowrap">{{ t('nav.dashboard') }}</span>
            }
          </a>

          <a routerLink="/projects"
             routerLinkActive="bg-slate-700 text-white"
             [pTooltip]="!sidebarExpanded() ? t('nav.projects') : ''"
             tooltipPosition="right"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <i class="pi pi-folder text-lg flex-shrink-0"></i>
            @if (sidebarExpanded()) {
              <span class="whitespace-nowrap">{{ t('nav.projects') }}</span>
            }
          </a>

          <a routerLink="/my-tasks"
             routerLinkActive="bg-slate-700 text-white"
             [pTooltip]="!sidebarExpanded() ? t('nav.myTasks') : ''"
             tooltipPosition="right"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <i class="pi pi-check-square text-lg flex-shrink-0"></i>
            @if (sidebarExpanded()) {
              <span class="whitespace-nowrap">{{ t('nav.myTasks') }}</span>
            }
          </a>

          <a routerLink="/notifications"
             routerLinkActive="bg-slate-700 text-white"
             [pTooltip]="!sidebarExpanded() ? t('nav.notifications') : ''"
             tooltipPosition="right"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors relative">
            <i class="pi pi-bell text-lg flex-shrink-0"></i>
            @if (sidebarExpanded()) {
              <span class="whitespace-nowrap">{{ t('nav.notifications') }}</span>
              @if (notificationStore.unreadCount() > 0) {
                <span class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                  {{ notificationStore.unreadCount() }}
                </span>
              }
            } @else {
              @if (notificationStore.unreadCount() > 0) {
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              }
            }
          </a>

          <!-- Admin Section -->
          @if (authService.isAdmin()) {
            <div class="pt-4 pb-2">
              @if (sidebarExpanded()) {
                <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ t('nav.admin') }}</p>
              } @else {
                <div class="border-t border-slate-700 mx-2 mb-2"></div>
              }
            </div>

            <a routerLink="/admin/users"
               routerLinkActive="bg-slate-700 text-white"
               [pTooltip]="!sidebarExpanded() ? t('nav.users') : ''"
               tooltipPosition="right"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
              <i class="pi pi-users text-lg flex-shrink-0"></i>
              @if (sidebarExpanded()) {
                <span class="whitespace-nowrap">{{ t('nav.users') }}</span>
              }
            </a>

            <a routerLink="/admin/audit"
               routerLinkActive="bg-slate-700 text-white"
               [pTooltip]="!sidebarExpanded() ? t('nav.auditLogs') : ''"
               tooltipPosition="right"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
              <i class="pi pi-history text-lg flex-shrink-0"></i>
              @if (sidebarExpanded()) {
                <span class="whitespace-nowrap">{{ t('nav.auditLogs') }}</span>
              }
            </a>

            <a routerLink="/admin/settings"
               routerLinkActive="bg-slate-700 text-white"
               [pTooltip]="!sidebarExpanded() ? t('nav.settings') : ''"
               tooltipPosition="right"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
              <i class="pi pi-cog text-lg flex-shrink-0"></i>
              @if (sidebarExpanded()) {
                <span class="whitespace-nowrap">{{ t('nav.settings') }}</span>
              }
            </a>
          }
        </nav>

        <!-- User Info & Logout -->
        <div class="border-t border-slate-700 p-3">
          <div class="flex items-center justify-between gap-2">
            @if (sidebarExpanded()) {
              <div class="flex items-center gap-3 min-w-0">
                <p-avatar
                  [label]="getInitials(authService.user()?.fullName || '')"
                  styleClass="bg-blue-500 flex-shrink-0"
                  shape="circle"
                  [style]="{ width: '36px', height: '36px' }"
                ></p-avatar>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white truncate">
                    {{ authService.user()?.fullName }}
                  </p>
                  <p class="text-xs text-slate-400 truncate">
                    {{ authService.user()?.email }}
                  </p>
                </div>
              </div>
            } @else {
              <p-avatar
                [label]="getInitials(authService.user()?.fullName || '')"
                styleClass="bg-blue-500 flex-shrink-0"
                shape="circle"
                [style]="{ width: '36px', height: '36px' }"
              ></p-avatar>
            }
            <button
              pButton
              icon="pi pi-sign-out"
              class="p-button-rounded p-button-danger flex-shrink-0"
              [pTooltip]="!sidebarExpanded() ? t('nav.logout') : ''"
              tooltipPosition="top"
              (click)="logout()"
            ></button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Bar -->
        <header class="h-16 bg-white border-b flex items-center justify-between gap-2 px-3 sm:px-6">
          <div class="flex items-center gap-2">
            <!-- Menu toggle (visible on all screen sizes) -->
            <button
              pButton
              icon="pi pi-bars"
              class="p-button-text p-button-rounded flex-shrink-0"
              (click)="toggleSidebar()"
            ></button>
            @if (!isMobile() && !sidebarExpanded()) {
              <span class="text-sm font-semibold text-gray-700 hidden sm:block">
                {{ currentRouteTitle() }}
              </span>
            }
          </div>

          <div class="flex items-center gap-1 sm:gap-3">
            <app-language-switcher></app-language-switcher>

            <a routerLink="/notifications"
               class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="pi pi-bell text-lg sm:text-xl"></i>
              @if (notificationStore.unreadCount() > 0) {
                <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {{ notificationStore.unreadCount() > 9 ? '9+' : notificationStore.unreadCount() }}
                </span>
              }
            </a>

            <div class="hidden sm:block h-8 w-px bg-gray-200"></div>

            <a routerLink="/profile"
               class="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-2 py-2 sm:px-3 transition-colors">
              <p-avatar
                [label]="getInitials(authService.user()?.fullName || '')"
                styleClass="bg-blue-500"
                shape="circle"
                [style]="{ width: '32px', height: '32px' }"
              ></p-avatar>
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-gray-900">{{ authService.user()?.fullName }}</p>
                <p class="text-xs text-gray-500">{{ authService.user()?.email }}</p>
              </div>
              <i class="pi pi-chevron-down text-gray-400 text-xs hidden md:block"></i>
            </a>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .sidebar-collapsed {
      width: 5rem;
    }

    .sidebar-expanded {
      width: 16rem;
    }

    @media (max-width: 1023px) {
      .sidebar-mobile {
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
      }

      .sidebar-mobile.open {
        transform: translateX(0);
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  authService = inject(AuthService);
  notificationStore = inject(NotificationStore);
  translationService = inject(TranslationService);
  private router = inject(Router);

  t = this.translationService.translate.bind(this.translationService);

  sidebarExpanded = signal(true);
  sidebarOpen = signal(false);
  isMobile = signal(false);

  private routeTitles: Record<string, string> = {
    '/dashboard': 'nav.dashboard',
    '/projects': 'nav.projects',
    '/my-tasks': 'nav.myTasks',
    '/notifications': 'nav.notifications',
    '/admin/users': 'nav.users',
    '/admin/audit': 'nav.auditLogs',
    '/admin/settings': 'nav.settings',
    '/profile': 'nav.profile'
  };

  currentRouteTitle(): string {
    const key = this.routeTitles[this.router.url.split('/').slice(0, 3).join('/')]
      ?? this.routeTitles['/' + (this.router.url.split('/')[1] || '')]
      ?? '';
    return key ? this.t(key) : '';
  }

  constructor() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.notificationStore.loadUnreadCount();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    if (!mobile) {
      this.sidebarOpen.set(false);
    }
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.sidebarOpen.update(v => !v);
    } else {
      this.sidebarExpanded.update(v => !v);
    }
  }

  closeSidebar(): void {
    if (this.isMobile()) {
      this.sidebarOpen.set(false);
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

  logout(): void {
    this.authService.logout();
  }
}
