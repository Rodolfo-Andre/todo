import { Component, inject, OnInit, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TimelineModule } from 'primeng/timeline';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TaskDetail, TaskStatus, TaskPriority, TaskAttachment } from '../../core/models/task.model';
import { TaskStore } from './task.store';
import { ProjectService, ProjectMember } from '../projects/project.service';
import { UserService } from '../users/user.service';
import { User } from '../../core/models/user.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    SelectModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    TimelineModule,
    DividerModule,
    DialogModule,
    FileUploadModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <p-button icon="pi pi-arrow-left" styleClass="p-button-text" (onClick)="goBack()"></p-button>
          <h1 class="text-2xl font-bold">{{ task?.title || 'Loading...' }}</h1>
        </div>
        <div class="flex gap-2">
          <p-button label="Edit" icon="pi pi-pencil" (onClick)="showEditDialog()"></p-button>
          <p-button label="Delete" icon="pi pi-trash" styleClass="p-button-danger" (onClick)="confirmDelete()"></p-button>
        </div>
      </div>

      @if (taskStore.isLoading()) {
        <p-card>
          <div class="text-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl"></i>
            <p class="mt-2 text-gray-500">Loading task...</p>
          </div>
        </p-card>
      } @else if (task) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Task Info -->
          <p-card styleClass="lg:col-span-2">
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">Task Information</h2>
              </div>
            </ng-template>

            <div class="flex flex-col gap-4">
              <div>
                <p class="text-sm text-gray-500 mb-1">Description</p>
                <p class="whitespace-pre-wrap">{{ task.description || 'No description provided' }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Status</p>
                  <div class="flex gap-2">
                    @for (status of statusOptions; track status.value) {
                      <button
                        pButton
                        [label]="status.label"
                        [class]="task.status === status.value ? 'p-button-' + status.severity : 'p-button-outlined'"
                        (onClick)="changeStatus(status.value)"
                        class="p-button-sm"
                      ></button>
                    }
                  </div>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Priority</p>
                  <p-tag [value]="getPriorityLabel(task.priority)" [severity]="getPrioritySeverity(task.priority)"></p-tag>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Story Points</p>
                  <p>{{ task.storyPoints || '-' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Due Date</p>
                  <p [class]="isOverdue(task.dueDate) ? 'text-red-500' : ''">
                    {{ task.dueDate ? (task.dueDate | date:'mediumDate') : 'No due date' }}
                  </p>
                </div>
              </div>

              <div>
                <p class="text-sm text-gray-500 mb-1">Tags</p>
                @if (task.tags) {
                  <div class="flex flex-wrap gap-2">
                    @for (tag of task.tags.split(','); track tag) {
                      <span class="px-2 py-1 bg-gray-100 rounded text-sm">{{ tag }}</span>
                    }
                  </div>
                } @else {
                  <p class="text-gray-400">No tags</p>
                }
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Created By</p>
                  <p>{{ task.createdByName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Created At</p>
                  <p>{{ task.createdAt | date:'medium' }}</p>
                </div>
              </div>
            </div>
          </p-card>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Assignment -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="px-4 py-3 border-b">
                  <h2 class="text-lg font-semibold">Assignment</h2>
                </div>
              </ng-template>

              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Assign To</label>
                  <p-select
                    [options]="users"
                    [(ngModel)]="selectedUserId"
                    optionLabel="fullName"
                    optionValue="id"
                    placeholder="Select user"
                    styleClass="w-full"
                    [showClear]="true"
                    (onChange)="assignTask()"
                  ></p-select>
                </div>
                @if (task.assignedToName) {
                  <div class="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {{ getInitials(task.assignedToName) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ task.assignedToName }}</p>
                    </div>
                  </div>
                }
              </div>
            </p-card>

            <!-- Comments -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="px-4 py-3 border-b">
                  <h2 class="text-lg font-semibold">Comments ({{ task.comments?.length || 0 }})</h2>
                </div>
              </ng-template>

              <div class="flex flex-col gap-4">
                <div class="flex gap-2">
                  <textarea
                    pInputTextarea
                    [(ngModel)]="newComment"
                    class="flex-1"
                    rows="2"
                    placeholder="Add a comment..."
                  ></textarea>
                  <p-button icon="pi pi-send" (onClick)="addComment()" [disabled]="!newComment.trim()"></p-button>
                </div>

                @if (task.comments && task.comments.length > 0) {
                  <div class="flex flex-col gap-3">
                    @for (comment of task.comments; track comment.id) {
                      <div class="p-3 bg-gray-50 rounded">
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center gap-2">
                            <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                              {{ getInitials(comment.userFullName || comment.userName) }}
                            </div>
                            <span class="text-sm font-medium">{{ comment.userFullName || comment.userName }}</span>
                          </div>
                          <span class="text-xs text-gray-500">{{ comment.createdAt | date:'short' }}</span>
                        </div>
                        <p class="text-sm whitespace-pre-wrap">{{ comment.content }}</p>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="text-center text-gray-400 py-4">No comments yet</p>
                }
              </div>
            </p-card>

            <!-- Attachments -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="px-4 py-3 border-b">
                  <h2 class="text-lg font-semibold">Attachments ({{ task.attachments?.length || 0 }})</h2>
                </div>
              </ng-template>

              <div class="flex flex-col gap-4">
                <div>
                  <p-fileUpload
                    #fileUpload
                    mode="basic"
                    name="file"
                    [auto]="true"
                    [customUpload]="true"
                    (uploadHandler)="onFileUpload($event)"
                    chooseLabel="Upload File"
                    chooseIcon="pi pi-upload"
                    styleClass="w-full"
                  ></p-fileUpload>
                </div>

                @if (task.attachments && task.attachments.length > 0) {
                  <div class="flex flex-col gap-2">
                    @for (attachment of task.attachments; track attachment.id) {
                      <div class="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                        <div class="flex items-center gap-3">
                          <i class="pi pi-file text-gray-500"></i>
                          <div>
                            <p class="text-sm font-medium">{{ attachment.fileName }}</p>
                            <p class="text-xs text-gray-500">{{ formatFileSize(attachment.fileSize) }}</p>
                          </div>
                        </div>
                        <div class="flex gap-1">
                          <p-button
                            icon="pi pi-download"
                            styleClass="p-button-text p-button-sm"
                            (onClick)="downloadAttachment(attachment)"
                            [routerLink]="[]"
                          ></p-button>
                          <p-button
                            icon="pi pi-trash"
                            styleClass="p-button-text p-button-danger p-button-sm"
                            (onClick)="confirmDeleteAttachment(attachment)"
                          ></p-button>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="text-center text-gray-400 py-4">No attachments</p>
                }
              </div>
            </p-card>

            <!-- History -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="px-4 py-3 border-b">
                  <h2 class="text-lg font-semibold">History</h2>
                </div>
              </ng-template>

              @if (task.histories && task.histories.length > 0) {
                <div class="flex flex-col gap-3">
                  @for (history of task.histories; track history.id) {
                    <div class="flex items-start gap-3 text-sm">
                      <i class="pi pi-clock text-gray-400 mt-1"></i>
                      <div>
                        <p>
                          <span class="font-medium">{{ history.userName }}</span>
                          {{ history.action.toLowerCase() }}
                          @if (history.oldValue) {
                            <span class="text-gray-500">{{ history.oldValue }}</span>
                          }
                          @if (history.newValue) {
                            <span class="text-gray-500"> → {{ history.newValue }}</span>
                          }
                        </p>
                        <p class="text-xs text-gray-400">{{ history.createdAt | date:'short' }}</p>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-center text-gray-400 py-4">No history</p>
              }
            </p-card>
          </div>
        </div>
      } @else {
        <p-card>
          <div class="text-center py-8">
            <p class="text-gray-500">Task not found.</p>
          </div>
        </p-card>
      }
    </div>

    <!-- Edit Task Dialog -->
    <p-dialog
      [(visible)]="editDialogVisible"
      header="Edit Task"
      [modal]="true"
      [style]="{ width: '500px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium">Title *</label>
          <input pInputText [(ngModel)]="editForm.title" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">Description</label>
          <textarea pInputTextarea [(ngModel)]="editForm.description" class="w-full" rows="3"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium">Priority</label>
            <p-select
              [options]="priorityOptions"
              [(ngModel)]="editForm.priority"
              optionLabel="label"
              optionValue="value"
              styleClass="w-full"
            ></p-select>
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium">Story Points</label>
            <input pInputText [(ngModel)]="editForm.storyPoints" type="number" class="w-full" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">Due Date</label>
          <input pInputText [(ngModel)]="editForm.dueDate" type="date" class="w-full" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" styleClass="p-button-text" (onClick)="editDialogVisible = false"></p-button>
        <p-button label="Save" (onClick)="saveTask()" [loading]="isSaving"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private translationService = inject(TranslationService);

  t = this.translationService.translate.bind(this.translationService);

  taskStore = inject(TaskStore);
  projectService = inject(ProjectService);
  userService = inject(UserService);

  task: TaskDetail | null = null;
  users: User[] = [];
  selectedUserId: string = '';
  newComment = '';
  editDialogVisible = false;
  isSaving = false;
  private taskId: string = '';

  editForm = {
    title: '',
    description: '',
    priority: 1,
    storyPoints: undefined as number | undefined,
    dueDate: undefined as string | undefined
  };

  statusOptions = [
    { label: 'Todo', value: 0, severity: 'secondary' },
    { label: 'In Progress', value: 1, severity: 'info' },
    { label: 'In Review', value: 2, severity: 'warn' },
    { label: 'Done', value: 3, severity: 'success' },
    { label: 'Cancelled', value: 4, severity: 'danger' }
  ];

  priorityOptions = [
    { label: 'Low', value: 0 },
    { label: 'Medium', value: 1 },
    { label: 'High', value: 2 },
    { label: 'Critical', value: 3 }
  ];

  constructor() {
    effect(() => {
      const currentTask = this.taskStore.selectedTask();
      if (currentTask && currentTask.id === this.taskId) {
        this.task = currentTask as TaskDetail;
        this.selectedUserId = this.task.assignedToId || '';
      }
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.taskId) {
      this.taskStore.loadTask(this.taskId);
      this.loadUsers();
    }
  }

  ngOnDestroy(): void {
    this.taskStore.clearSelectedTask();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
        }
      }
    });
  }

  goBack(): void {
    if (this.task) {
      this.router.navigate(['/projects', this.task.projectId]);
    } else {
      this.router.navigate(['/projects']);
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

  isOverdue(dueDate?: Date): boolean {
    if (!dueDate) return false;
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

  async changeStatus(status: number): Promise<void> {
    if (!this.task) return;

    const success = await this.taskStore.changeStatus(this.task.id, status, this.task.projectId);
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Status updated successfully'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update status'
      });
    }
  }

  async assignTask(): Promise<void> {
    if (!this.task) return;

    const success = await this.taskStore.assignTask(this.task.id, this.selectedUserId || undefined, this.task.projectId);
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Task assigned successfully'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to assign task'
      });
    }
  }

  async addComment(): Promise<void> {
    if (!this.task || !this.newComment.trim()) return;

    const success = await this.taskStore.addComment(this.task.id, this.newComment);
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Comment added successfully'
      });
      this.newComment = '';
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add comment'
      });
    }
  }

  async onFileUpload(event: any): Promise<void> {
    if (!this.task || !event.files || event.files.length === 0) return;

    const file = event.files[0];
    const success = await this.taskStore.uploadAttachment(this.task.id, file);
    
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File uploaded successfully'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to upload file'
      });
    }
  }

  downloadAttachment(attachment: TaskAttachment): void {
    // TODO: Implement download when backend file serving is ready
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Download functionality will be available when file serving is configured'
    });
  }

  confirmDeleteAttachment(attachment: TaskAttachment): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${attachment.fileName}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteAttachment(attachment);
      }
    });
  }

  async deleteAttachment(attachment: TaskAttachment): Promise<void> {
    if (!this.task) return;

    const success = await this.taskStore.deleteAttachment(attachment.id, this.task.id);
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Attachment deleted successfully'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete attachment'
      });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  showEditDialog(): void {
    if (!this.task) return;

    this.editForm = {
      title: this.task.title,
      description: this.task.description || '',
      priority: this.task.priority,
      storyPoints: this.task.storyPoints,
      dueDate: this.task.dueDate ? new Date(this.task.dueDate).toISOString().split('T')[0] : undefined
    };
    this.editDialogVisible = true;
  }

  async saveTask(): Promise<void> {
    if (!this.task || !this.editForm.title.trim()) return;

    this.isSaving = true;
    const success = await this.taskStore.updateTask(this.task.id, this.task.projectId, {
      title: this.editForm.title,
      description: this.editForm.description,
      priority: this.editForm.priority,
      storyPoints: this.editForm.storyPoints,
      dueDate: this.editForm.dueDate ? new Date(this.editForm.dueDate) : undefined
    });
    this.isSaving = false;

    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Task updated successfully'
      });
      this.editDialogVisible = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update task'
      });
    }
  }

  confirmDelete(): void {
    if (!this.task) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${this.task.title}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteTask();
      }
    });
  }

  async deleteTask(): Promise<void> {
    if (!this.task) return;

    const success = await this.taskStore.deleteTask(this.task.id, this.task.projectId);
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Task deleted successfully'
      });
      this.router.navigate(['/projects', this.task.projectId]);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete task'
      });
    }
  }
}
