import { Injectable, signal, computed, inject } from '@angular/core';
import { Task, TaskStatus } from '../../core/models/task.model';
import { TaskService, TaskFilters } from './task.service';
import { TranslationService } from '../../core/i18n/translation.service';

@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  private taskService: TaskService;
  private translationService = inject(TranslationService);

  // State
  private _tasks = signal<Task[]>([]);
  private _selectedTask = signal<Task | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _filters = signal<TaskFilters>({});

  // Computed
  tasks = this._tasks.asReadonly();
  selectedTask = this._selectedTask.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();
  filters = this._filters.asReadonly();

  // Computed filtered tasks
  todoTasks = computed(() => this._tasks().filter(t => t.status === TaskStatus.Todo));
  inProgressTasks = computed(() => this._tasks().filter(t => t.status === TaskStatus.InProgress));
  inReviewTasks = computed(() => this._tasks().filter(t => t.status === TaskStatus.InReview));
  doneTasks = computed(() => this._tasks().filter(t => t.status === TaskStatus.Done));

  taskCount = computed(() => this._tasks().length);
  completedCount = computed(() => this._tasks().filter(t => t.status === TaskStatus.Done).length);

  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  loadTasksByProject(projectId: string, filters?: TaskFilters): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.taskService.getTasksByProject(projectId, filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this._tasks.set(response.data);
        } else {
          this._error.set(response.errors?.[0] || this.translationService.translate('tasks.loadFailed'));
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set(this.translationService.translate('tasks.loadFailed'));
        this._isLoading.set(false);
      }
    });
  }

  loadMyTasks(filters?: TaskFilters): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.taskService.getMyTasks(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this._tasks.set(response.data);
        } else {
          this._error.set(response.errors?.[0] || this.translationService.translate('tasks.loadFailed'));
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set(this.translationService.translate('tasks.loadFailed'));
        this._isLoading.set(false);
      }
    });
  }

  loadTask(id: string): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.taskService.getTaskById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this._selectedTask.set(response.data as Task);
        } else {
          this._error.set(response.errors?.[0] || this.translationService.translate('tasks.loadFailed'));
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set(this.translationService.translate('tasks.loadFailed'));
        this._isLoading.set(false);
      }
    });
  }

  createTask(projectId: string, request: any): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.createTask({ ...request, projectId }).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTasksByProject(projectId);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('tasks.createFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('tasks.createFailed'));
          resolve(false);
        }
      });
    });
  }

  updateTask(id: string, projectId: string, request: any): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.updateTask(id, request).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTasksByProject(projectId);
            this.loadTask(id);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('tasks.updateFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('tasks.updateFailed'));
          resolve(false);
        }
      });
    });
  }

  deleteTask(id: string, projectId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.deleteTask(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTasksByProject(projectId);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('tasks.deleteFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('tasks.deleteFailed'));
          resolve(false);
        }
      });
    });
  }

  changeStatus(id: string, status: number, projectId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.changeStatus(id, status).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTasksByProject(projectId);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('tasks.statusUpdateFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('tasks.statusUpdateFailed'));
          resolve(false);
        }
      });
    });
  }

  assignTask(id: string, assignedToId: string | undefined, projectId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.assignTask(id, assignedToId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTasksByProject(projectId);
            this.loadTask(id);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('tasks.assignFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('tasks.assignFailed'));
          resolve(false);
        }
      });
    });
  }

  reorderTask(id: string, orderIndex: number, newStatus: number | undefined, projectId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.reorderTask(id, orderIndex, newStatus).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTasksByProject(projectId);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('tasks.reorderFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('tasks.reorderFailed'));
          resolve(false);
        }
      });
    });
  }

  addComment(taskId: string, content: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.addComment(taskId, content).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTask(taskId);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('tasks.commentFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('tasks.commentFailed'));
          resolve(false);
        }
      });
    });
  }

  uploadAttachment(taskId: string, file: File): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.uploadAttachment(taskId, file).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTask(taskId);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('tasks.uploadFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('tasks.uploadFailed'));
          resolve(false);
        }
      });
    });
  }

  deleteAttachment(attachmentId: string, taskId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.deleteAttachment(attachmentId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTask(taskId);
            resolve(true);
          } else {
            this._error.set(response.errors?.[0] || this.translationService.translate('tasks.deleteAttachmentFailed'));
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set(this.translationService.translate('tasks.deleteAttachmentFailed'));
          resolve(false);
        }
      });
    });
  }

  setFilters(filters: TaskFilters): void {
    this._filters.set(filters);
  }

  clearError(): void {
    this._error.set(null);
  }

  clearSelectedTask(): void {
    this._selectedTask.set(null);
  }
}
