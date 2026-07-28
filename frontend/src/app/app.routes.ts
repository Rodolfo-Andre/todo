import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/project-list.component').then(m => m.ProjectListComponent)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/project-detail.component').then(m => m.ProjectDetailComponent)
      },
      {
        path: 'projects/:id/board',
        loadComponent: () => import('./features/tasks/task-board.component').then(m => m.TaskBoardComponent)
      },
      {
        path: 'projects/:id/list',
        loadComponent: () => import('./features/tasks/task-list.component').then(m => m.TaskListComponent)
      },
      {
        path: 'tasks/:id',
        loadComponent: () => import('./features/tasks/task-detail.component').then(m => m.TaskDetailComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notification-list.component').then(m => m.NotificationListComponent)
      },
      {
        path: 'my-tasks',
        loadComponent: () => import('./features/tasks/my-tasks.component').then(m => m.MyTasksComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        children: [
          {
            path: 'users',
            loadComponent: () => import('./features/users/user-list.component').then(m => m.UserListComponent)
          },
          {
            path: 'users/:id',
            loadComponent: () => import('./features/users/user-detail.component').then(m => m.UserDetailComponent)
          },
          {
            path: 'audit',
            loadComponent: () => import('./features/audit/audit-log-list.component').then(m => m.AuditLogListComponent)
          },
          {
            path: 'settings',
            loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
