import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus } from '../../core/models/task.model';
import { TaskService, TaskFilters } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  private taskService: TaskService;

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
          this._error.set(response.errors?.[0] || 'Failed to load tasks');
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set('Failed to load tasks');
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
          this._error.set(response.errors?.[0] || 'Failed to load tasks');
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set('Failed to load tasks');
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
          this._error.set(response.errors?.[0] || 'Failed to load task');
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._error.set('Failed to load task');
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
            this._error.set(response.errors?.[0] || 'Failed to create task');
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set('Failed to create task');
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
            this._error.set(response.errors?.[0] || 'Failed to update task');
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set('Failed to update task');
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
            this._error.set(response.errors?.[0] || 'Failed to delete task');
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set('Failed to delete task');
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
            this._error.set(response.errors?.[0] || 'Failed to change status');
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set('Failed to change status');
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
            this._error.set(response.errors?.[0] || 'Failed to assign task');
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set('Failed to assign task');
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
            this._error.set(response.errors?.[0] || 'Failed to reorder task');
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set('Failed to reorder task');
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
            this._error.set(response.errors?.[0] || 'Failed to add comment');
            resolve(false);
          }
        },
        error: (error) => {
          this._error.set('Failed to add comment');
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
