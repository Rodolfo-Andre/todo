import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    ButtonModule
  ],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <p-card styleClass="text-center">
          <div class="text-3xl font-bold text-primary">12</div>
          <div class="text-gray-500">Total Projects</div>
        </p-card>

        <p-card styleClass="text-center">
          <div class="text-3xl font-bold text-green-500">24</div>
          <div class="text-gray-500">My Tasks</div>
        </p-card>

        <p-card styleClass="text-center">
          <div class="text-3xl font-bold text-orange-500">8</div>
          <div class="text-gray-500">In Progress</div>
        </p-card>

        <p-card styleClass="text-center">
          <div class="text-3xl font-bold text-red-500">3</div>
          <div class="text-gray-500">Overdue</div>
        </p-card>
      </div>

      <!-- Recent Activity -->
      <p-card>
        <ng-template pTemplate="header">
          <div class="px-4 py-3 border-b">
            <h2 class="text-lg font-semibold">Recent Activity</h2>
          </div>
        </ng-template>
        <p class="text-gray-500">No recent activity to display.</p>
      </p-card>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Load dashboard data
  }
}
