import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Task, TaskStatus, TaskPriority } from '../../core/models/task.model';
import { TaskStore } from './task.store';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    SelectModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">My Tasks</h1>
        <div class="flex gap-2">
          <input
            pInputText
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Search tasks..."
            class="w-64"
          />
          <p-select
            [options]="statusOptions"
            [(ngModel)]="selectedStatus"
            optionLabel="label"
            optionValue="value"
            placeholder="All Status"
            styleClass="w-48"
            [showClear]="true"
            (onChange)="onFilterChange()"
          ></p-select>
          <p-select
            [options]="priorityOptions"
            [(ngModel)]="selectedPriority"
            optionLabel="label"
            optionValue="value"
            placeholder="All Priorities"
            styleClass="w-48"
            [showClear]="true"
            (onChange)="onFilterChange()"
          ></p-select>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <p-card styleClass="text-center">
          <div class="text-2xl font-bold text-gray-800">{{ taskStore.taskCount() }}</div>
          <div class="text-sm text-gray-500">Total</div>
        </p-card>
        <p-card styleClass="text-center">
          <div class="text-2xl font-bold text-gray-600">{{ getTodoCount() }}</div>
          <div class="text-sm text-gray-500">Todo</div>
        </p-card>
        <p-card styleClass="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ getInProgressCount() }}</div>
          <div class="text-sm text-gray-500">In Progress</div>
        </p-card>
        <p-card styleClass="text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ getInReviewCount() }}</div>
          <div class="text-sm text-gray-500">In Review</div>
        </p-card>
        <p-card styleClass="text-center">
          <div class="text-2xl font-bold text-green-600">{{ taskStore.completedCount() }}</div>
          <div class="text-sm text-gray-500">Done</div>
        </p-card>
      </div>

      <!-- Tasks Table -->
      <p-card>
        <p-table [value]="taskStore.tasks()" [loading]="taskStore.isLoading()" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 25, 50]">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="title">Title <p-sortIcon field="title"></p-sortIcon></th>
              <th pSortableColumn="projectName">Project <p-sortIcon field="projectName"></p-sortIcon></th>
              <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
              <th pSortableColumn="priority">Priority <p-sortIcon field="priority"></p-sortIcon></th>
              <th pSortableColumn="storyPoints">Story Points <p-sortIcon field="storyPoints"></p-sortIcon></th>
              <th pSortableColumn="dueDate">Due Date <p-sortIcon field="dueDate"></p-sortIcon></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-task>
            <tr>
              <td>
                <a [routerLink]="['/tasks', task.id]" class="font-medium text-blue-600 hover:underline">
                  {{ task.title }}
                </a>
                @if (task.description) {
                  <p class="text-sm text-gray-500 mt-1">{{ task.description | slice:0:60 }}{{ task.description.length > 60 ? '...' : '' }}</p>
                }
              </td>
              <td>
                <a [routerLink]="['/projects', task.projectId]" class="text-blue-600 hover:underline">
                  {{ task.projectName || 'Unknown' }}
                </a>
              </td>
              <td>
                <p-tag [value]="getStatusLabel(task.status)" [severity]="getStatusSeverity(task.status)"></p-tag>
              </td>
              <td>
                <p-tag [value]="getPriorityLabel(task.priority)" [severity]="getPrioritySeverity(task.priority)"></p-tag>
              </td>
              <td>
                @if (task.storyPoints) {
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{{ task.storyPoints }}</span>
                } @else {
                  <span class="text-gray-400">-</span>
                }
              </td>
              <td>
                @if (task.dueDate) {
                  <span [class]="isOverdue(task.dueDate) ? 'text-red-500 font-medium' : ''">
                    {{ task.dueDate | date:'shortDate' }}
                    @if (isOverdue(task.dueDate)) {
                      <span class="text-xs ml-1">(Overdue)</span>
                    }
                  </span>
                } @else {
                  <span class="text-gray-400">No due date</span>
                }
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-12">
                <div class="flex flex-col items-center gap-4">
                  <i class="pi pi-check-square text-5xl text-gray-300"></i>
                  <p class="text-gray-500 text-lg">No tasks assigned to you</p>
                  <p class="text-gray-400">Tasks assigned to you will appear here</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `
})
export class MyTasksComponent implements OnInit {
  taskStore = inject(TaskStore);
  private messageService = inject(MessageService);
  private translationService = inject(TranslationService);

  t = this.translationService.translate.bind(this.translationService);

  searchTerm = '';
  selectedStatus: number | null = null;
  selectedPriority: number | null = null;

  statusOptions = [
    { label: 'Todo', value: 0 },
    { label: 'In Progress', value: 1 },
    { label: 'In Review', value: 2 },
    { label: 'Done', value: 3 },
    { label: 'Cancelled', value: 4 }
  ];

  priorityOptions = [
    { label: 'Low', value: 0 },
    { label: 'Medium', value: 1 },
    { label: 'High', value: 2 },
    { label: 'Critical', value: 3 }
  ];

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const filters: any = {};
    if (this.selectedStatus !== null) filters.status = this.selectedStatus;
    if (this.selectedPriority !== null) filters.priority = this.selectedPriority;
    if (this.searchTerm) filters.search = this.searchTerm;

    this.taskStore.loadMyTasks(filters);
  }

  onSearch(): void {
    this.loadTasks();
  }

  onFilterChange(): void {
    this.loadTasks();
  }

  getTodoCount(): number {
    return this.taskStore.tasks().filter(t => t.status === TaskStatus.Todo).length;
  }

  getInProgressCount(): number {
    return this.taskStore.tasks().filter(t => t.status === TaskStatus.InProgress).length;
  }

  getInReviewCount(): number {
    return this.taskStore.tasks().filter(t => t.status === TaskStatus.InReview).length;
  }

  getStatusLabel(status: number): string {
    const labels = ['Todo', 'In Progress', 'In Review', 'Done', 'Cancelled'];
    return labels[status] || 'Unknown';
  }

  getStatusSeverity(status: number): string {
    const severities = ['secondary', 'info', 'warn', 'success', 'danger'];
    return severities[status] || 'secondary';
  }

  getPriorityLabel(priority: number): string {
    const labels = ['Low', 'Medium', 'High', 'Critical'];
    return labels[priority] || 'Unknown';
  }

  getPrioritySeverity(priority: number): string {
    const severities = ['success', 'info', 'warn', 'danger'];
    return severities[priority] || 'secondary';
  }

  isOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }
}
