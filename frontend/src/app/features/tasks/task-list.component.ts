import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextarea } from 'primeng/inputtextarea';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Task, TaskStatus, TaskPriority } from '../../core/models/task.model';
import { TaskStore } from './task.store';
import { ProjectService, Project, ProjectMember } from '../projects/project.service';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    SelectModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextarea
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <p-button icon="pi pi-arrow-left" styleClass="p-button-text" routerLink="/projects/{{ projectId }}"></p-button>
          <h1 class="text-2xl font-bold">Task List</h1>
        </div>
        <div class="flex gap-2">
          <input
            pInputText
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Search tasks..."
            class="w-64"
          />
          <p-button label="New Task" icon="pi pi-plus" (onClick)="showCreateDialog()"></p-button>
        </div>
      </div>

      <p-card>
        <p-table [value]="taskStore.tasks()" [loading]="taskStore.isLoading()" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Story Points</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-task>
            <tr>
              <td>
                <a [routerLink]="['/tasks', task.id]" class="font-medium text-blue-600 hover:underline">
                  {{ task.title }}
                </a>
                @if (task.description) {
                  <p class="text-sm text-gray-500 mt-1">{{ task.description | slice:0:50 }}{{ task.description.length > 50 ? '...' : '' }}</p>
                }
              </td>
              <td>
                <p-tag [value]="getStatusLabel(task.status)" [severity]="getStatusSeverity(task.status)"></p-tag>
              </td>
              <td>
                <p-tag [value]="getPriorityLabel(task.priority)" [severity]="getPrioritySeverity(task.priority)"></p-tag>
              </td>
              <td>
                @if (task.assignedToName) {
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {{ getInitials(task.assignedToName) }}
                    </div>
                    <span>{{ task.assignedToName }}</span>
                  </div>
                } @else {
                  <span class="text-gray-400">Unassigned</span>
                }
              </td>
              <td>
                @if (task.storyPoints) {
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ task.storyPoints }}</span>
                } @else {
                  <span class="text-gray-400">-</span>
                }
              </td>
              <td>
                @if (task.dueDate) {
                  <span [class]="isOverdue(task.dueDate) ? 'text-red-500' : ''">{{ task.dueDate | date:'shortDate' }}</span>
                } @else {
                  <span class="text-gray-400">-</span>
                }
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button icon="pi pi-pencil" styleClass="p-button-text p-button-rounded p-button-sm" (onClick)="showEditDialog(task)"></p-button>
                  <p-button icon="pi pi-trash" styleClass="p-button-text p-button-rounded p-button-sm p-button-danger" (onClick)="confirmDelete(task)"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center py-8">
                <div class="flex flex-col items-center gap-4">
                  <i class="pi pi-check-square text-4xl text-gray-300"></i>
                  <p class="text-gray-500">No tasks found</p>
                  <p-button label="Create your first task" icon="pi pi-plus" (onClick)="showCreateDialog()"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <!-- Create/Edit Task Dialog -->
    <p-dialog
      [(visible)]="dialogVisible"
      [header]="isEditMode ? 'Edit Task' : 'Create Task'"
      [modal]="true"
      [style]="{ width: '500px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium">Title *</label>
          <input pInputText [(ngModel)]="taskForm.title" class="w-full" placeholder="Task title" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">Description</label>
          <textarea pInputTextarea [(ngModel)]="taskForm.description" class="w-full" rows="3" placeholder="Task description..."></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium">Priority</label>
            <p-select
              [options]="priorityOptions"
              [(ngModel)]="taskForm.priority"
              optionLabel="label"
              optionValue="value"
              styleClass="w-full"
            ></p-select>
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium">Story Points</label>
            <input pInputText [(ngModel)]="taskForm.storyPoints" type="number" class="w-full" placeholder="0" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">Due Date</label>
          <input pInputText [(ngModel)]="taskForm.dueDate" type="date" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">Assign To</label>
          <p-select
            [options]="members"
            [(ngModel)]="taskForm.assignedToId"
            optionLabel="fullName"
            optionValue="userId"
            placeholder="Select member"
            styleClass="w-full"
            [showClear]="true"
          ></p-select>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" styleClass="p-button-text" (onClick)="hideDialog()"></p-button>
        <p-button [label]="isEditMode ? 'Save' : 'Create'" (onClick)="saveTask()" [loading]="isSaving"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class TaskListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private translationService = inject(TranslationService);

  t = this.translationService.translate.bind(this.translationService);

  taskStore = inject(TaskStore);
  projectService = inject(ProjectService);

  projectId = '';
  members: ProjectMember[] = [];
  searchTerm = '';
  dialogVisible = false;
  isEditMode = false;
  isSaving = false;
  selectedTask: Task | null = null;

  taskForm = {
    title: '',
    description: '',
    priority: 1,
    storyPoints: undefined as number | undefined,
    dueDate: undefined as string | undefined,
    assignedToId: undefined as string | undefined
  };

  priorityOptions = [
    { label: 'Low', value: 0 },
    { label: 'Medium', value: 1 },
    { label: 'High', value: 2 },
    { label: 'Critical', value: 3 }
  ];

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    if (this.projectId) {
      this.loadMembers();
      this.taskStore.loadTasksByProject(this.projectId);
    }
  }

  loadMembers(): void {
    this.projectService.getProjectMembers(this.projectId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.members = response.data;
        }
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.taskStore.loadTasksByProject(this.projectId, { search: this.searchTerm });
    } else {
      this.taskStore.loadTasksByProject(this.projectId);
    }
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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  showCreateDialog(): void {
    this.isEditMode = false;
    this.selectedTask = null;
    this.taskForm = {
      title: '',
      description: '',
      priority: 1,
      storyPoints: undefined,
      dueDate: undefined,
      assignedToId: undefined
    };
    this.dialogVisible = true;
  }

  showEditDialog(task: Task): void {
    this.isEditMode = true;
    this.selectedTask = task;
    this.taskForm = {
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      storyPoints: task.storyPoints,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : undefined,
      assignedToId: task.assignedToId
    };
    this.dialogVisible = true;
  }

  hideDialog(): void {
    this.dialogVisible = false;
    this.taskForm = {
      title: '',
      description: '',
      priority: 1,
      storyPoints: undefined,
      dueDate: undefined,
      assignedToId: undefined
    };
  }

  async saveTask(): Promise<void> {
    if (!this.taskForm.title.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Task title is required'
      });
      return;
    }

    this.isSaving = true;
    let success = false;

    if (this.isEditMode && this.selectedTask) {
      success = await this.taskStore.updateTask(this.selectedTask.id, this.projectId, {
        title: this.taskForm.title,
        description: this.taskForm.description,
        priority: this.taskForm.priority,
        storyPoints: this.taskForm.storyPoints,
        dueDate: this.taskForm.dueDate ? new Date(this.taskForm.dueDate) : undefined
      });
    } else {
      success = await this.taskStore.createTask(this.projectId, {
        ...this.taskForm,
        dueDate: this.taskForm.dueDate ? new Date(this.taskForm.dueDate) : undefined
      });
    }

    this.isSaving = false;

    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.isEditMode ? 'Task updated successfully' : 'Task created successfully'
      });
      this.hideDialog();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.isEditMode ? 'Failed to update task' : 'Failed to create task'
      });
    }
  }

  confirmDelete(task: Task): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${task.title}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteTask(task.id);
      }
    });
  }

  async deleteTask(id: string): Promise<void> {
    const success = await this.taskStore.deleteTask(id, this.projectId);
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Task deleted successfully'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete task'
      });
    }
  }
}
