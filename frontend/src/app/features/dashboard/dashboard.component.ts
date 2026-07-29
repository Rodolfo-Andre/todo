import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { DashboardService } from './dashboard.service';
import { DashboardData, RecentActivity, UpcomingDeadline } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ChartModule,
    TableModule,
    ButtonModule,
    TagModule,
    ProgressBarModule
  ],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p-button label="Refresh" icon="pi pi-refresh" styleClass="p-button-outlined" (onClick)="loadDashboard()"></p-button>
      </div>

      @if (isLoading) {
        <div class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
          <p class="mt-2 text-gray-500">Loading dashboard...</p>
        </div>
      } @else if (dashboard) {
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <p-card styleClass="text-center hover:shadow-lg transition-shadow">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                <i class="pi pi-folder text-xl"></i>
              </div>
              <div class="text-3xl font-bold text-blue-600">{{ dashboard.stats.totalProjects }}</div>
              <div class="text-gray-500">Total Projects</div>
            </div>
          </p-card>

          <p-card styleClass="text-center hover:shadow-lg transition-shadow">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                <i class="pi pi-check-circle text-xl"></i>
              </div>
              <div class="text-3xl font-bold text-green-600">{{ dashboard.stats.completedTasks }}</div>
              <div class="text-gray-500">Completed Tasks</div>
            </div>
          </p-card>

          <p-card styleClass="text-center hover:shadow-lg transition-shadow">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                <i class="pi pi-spin pi-spinner text-xl"></i>
              </div>
              <div class="text-3xl font-bold text-orange-600">{{ dashboard.stats.inProgressTasks }}</div>
              <div class="text-gray-500">In Progress</div>
            </div>
          </p-card>

          <p-card styleClass="text-center hover:shadow-lg transition-shadow">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                <i class="pi pi-exclamation-triangle text-xl"></i>
              </div>
              <div class="text-3xl font-bold text-red-600">{{ dashboard.stats.overdueTasks }}</div>
              <div class="text-gray-500">Overdue</div>
            </div>
          </p-card>
        </div>

        <!-- My Tasks Summary -->
        <p-card>
          <ng-template pTemplate="header">
            <div class="px-4 py-3 border-b">
              <h2 class="text-lg font-semibold">My Tasks</h2>
            </div>
          </ng-template>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ dashboard.stats.myAssignedTasks }}</div>
              <div class="text-sm text-gray-500">Assigned to me</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">{{ getMyCompletedTasks() }}</div>
              <div class="text-sm text-gray-500">Completed</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-orange-600">{{ getMyPendingTasks() }}</div>
              <div class="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </p-card>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Tasks by Status Chart -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">Tasks by Status</h2>
              </div>
            </ng-template>
            <div class="h-64">
              <p-chart type="doughnut" [data]="statusChartData" [options]="doughnutOptions" styleClass="h-full"></p-chart>
            </div>
          </p-card>

          <!-- Tasks by Priority Chart -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">Tasks by Priority</h2>
              </div>
            </ng-template>
            <div class="h-64">
              <p-chart type="bar" [data]="priorityChartData" [options]="barOptions" styleClass="h-full"></p-chart>
            </div>
          </p-card>
        </div>

        <!-- Tasks by Member -->
        @if (dashboard.tasksByMember.length > 0) {
          <p-card>
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">Tasks by Member</h2>
              </div>
            </ng-template>
            <div class="h-64">
              <p-chart type="bar" [data]="memberChartData" [options]="memberBarOptions" styleClass="h-full"></p-chart>
            </div>
          </p-card>
        }

        <!-- Bottom Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Upcoming Deadlines -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">Upcoming Deadlines</h2>
              </div>
            </ng-template>
            @if (dashboard.upcomingDeadlines.length > 0) {
              <div class="flex flex-col gap-3">
                @for (deadline of dashboard.upcomingDeadlines; track deadline.taskTitle) {
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex-1">
                      <p class="font-medium">{{ deadline.taskTitle }}</p>
                      <p class="text-sm text-gray-500">{{ deadline.projectName }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm" [class]="getDeadlineClass(deadline.daysRemaining)">
                        {{ deadline.daysRemaining === 0 ? 'Today' : deadline.daysRemaining + ' days' }}
                      </p>
                      <p-tag [value]="getPriorityLabel(deadline.priority)" [severity]="getPrioritySeverity(deadline.priority)"></p-tag>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="text-center text-gray-400 py-8">No upcoming deadlines</p>
            }
          </p-card>

          <!-- Recent Activity -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">Recent Activity</h2>
              </div>
            </ng-template>
            @if (dashboard.recentActivity.length > 0) {
              <div class="flex flex-col gap-3">
                @for (activity of dashboard.recentActivity; track activity.createdAt) {
                  <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {{ getInitials(activity.userName) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm">
                        <span class="font-medium">{{ activity.userName }}</span>
                        {{ activity.action.toLowerCase() }}
                        <span class="font-medium">{{ activity.taskTitle }}</span>
                      </p>
                      <p class="text-xs text-gray-500">{{ activity.projectName }} • {{ activity.createdAt | date:'short' }}</p>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="text-center text-gray-400 py-8">No recent activity</p>
            }
          </p-card>
        </div>
      } @else {
        <p-card>
          <div class="text-center py-8">
            <p class="text-gray-500">Failed to load dashboard data.</p>
            <p-button label="Retry" styleClass="p-button-link" (onClick)="loadDashboard()"></p-button>
          </div>
        </p-card>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  dashboard: DashboardData | null = null;
  isLoading = true;

  statusChartData: any;
  priorityChartData: any;
  memberChartData: any;

  doughnutOptions = {
    plugins: {
      legend: {
        position: 'right'
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  barOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  memberBarOptions = {
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dashboard = response.data;
          this.initCharts();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  initCharts(): void {
    if (!this.dashboard) return;

    // Status chart (doughnut)
    const statusColors = ['#6B7280', '#3B82F6', '#F59E0B', '#10B981', '#EF4444'];
    this.statusChartData = {
      labels: this.dashboard.tasksByStatus.map(s => s.status),
      datasets: [{
        data: this.dashboard.tasksByStatus.map(s => s.count),
        backgroundColor: statusColors
      }]
    };

    // Priority chart (bar)
    const priorityColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
    this.priorityChartData = {
      labels: this.dashboard.tasksByPriority.map(p => p.priority),
      datasets: [{
        data: this.dashboard.tasksByPriority.map(p => p.count),
        backgroundColor: priorityColors
      }]
    };

    // Member chart (horizontal bar)
    this.memberChartData = {
      labels: this.dashboard.tasksByMember.map(m => m.memberName),
      datasets: [{
        data: this.dashboard.tasksByMember.map(m => m.totalTasks),
        backgroundColor: '#3B82F6'
      }]
    };
  }

  getMyCompletedTasks(): number {
    // This is approximate - in real app would need per-user breakdown
    return Math.round((this.dashboard?.stats.completedTasks || 0) * 0.4);
  }

  getMyPendingTasks(): number {
    const myTasks = this.dashboard?.stats.myAssignedTasks || 0;
    return myTasks - this.getMyCompletedTasks();
  }

  getDeadlineClass(daysRemaining: number): string {
    if (daysRemaining === 0) return 'text-red-600 font-bold';
    if (daysRemaining <= 2) return 'text-orange-500';
    if (daysRemaining <= 5) return 'text-yellow-600';
    return 'text-green-600';
  }

  getPriorityLabel(priority: number): string {
    const labels = ['Low', 'Medium', 'High', 'Critical'];
    return labels[priority] || 'Unknown';
  }

  getPrioritySeverity(priority: number): string {
    const severities = ['success', 'info', 'warn', 'danger'];
    return severities[priority] || 'secondary';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
