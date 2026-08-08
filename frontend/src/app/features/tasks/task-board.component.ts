import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
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
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
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
          <h1 class="text-2xl font-bold">Task Board</h1>
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

      @if (taskStore.isLoading()) {
        <div class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
          <p class="mt-2 text-gray-500">Loading tasks...</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[600px]">
          <!-- Todo Column -->
          <div
            class="bg-gray-50 rounded-lg p-4 transition-colors"
            [class.ring-2]="dragOverStatus === 0"
            [class.ring-gray-400]="dragOverStatus === 0"
            [class.bg-gray-100]="dragOverStatus === 0"
            (dragover)="onDragOverColumn($event, 0)"
            (dragleave)="onDragLeaveColumn()"
            (drop)="onDropOnColumn($event, 0)"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-700">Todo</h3>
              <span class="px-2 py-1 bg-gray-200 rounded-full text-sm">{{ taskStore.todoTasks().length }}</span>
            </div>
            <div class="space-y-3 min-h-[100px]">
              @for (task of taskStore.todoTasks(); track task.id) {
                <div
                  class="bg-white rounded-lg p-4 shadow-sm cursor-grab hover:shadow-md transition-all border-l-4 border-gray-400"
                  [class.opacity-50]="draggedTask?.id === task.id"
                  [class.scale-95]="draggedTask?.id === task.id"
                  (click)="showTaskDetail(task)"
                  draggable="true"
                  (dragstart)="onDragStart($event, task)"
                  (dragend)="onDragEnd()"
                >
                  <div class="flex items-start justify-between">
                    <h4 class="font-medium text-gray-800">{{ task.title }}</h4>
                    @if (task.priority === 3) {
                      <span class="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Critical</span>
                    }
                  </div>
                  @if (task.description) {
                    <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ task.description }}</p>
                  }
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center gap-2">
                      @if (task.storyPoints) {
                        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ task.storyPoints }} SP</span>
                      }
                      @if (task.dueDate) {
                        <span class="text-xs text-gray-500">{{ task.dueDate | date:'shortDate' }}</span>
                      }
                    </div>
                    @if (task.assignedToName) {
                      <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {{ getInitials(task.assignedToName) }}
                      </div>
                    }
                  </div>
                  @if (task.commentCount > 0 || task.attachmentCount > 0) {
                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      @if (task.commentCount > 0) {
                        <span><i class="pi pi-comments"></i> {{ task.commentCount }}</span>
                      }
                      @if (task.attachmentCount > 0) {
                        <span><i class="pi pi-paperclip"></i> {{ task.attachmentCount }}</span>
                      }
                    </div>
                  }
                </div>
              } @empty {
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400"
                  [class.border-blue-400]="dragOverStatus === 0"
                  [class.text-blue-500]="dragOverStatus === 0"
                  [class.bg-blue-50]="dragOverStatus === 0"
                >
                  @if (dragOverStatus === 0) {
                    <i class="pi pi-plus-circle text-2xl mb-2"></i>
                    <p>Drop here</p>
                  } @else {
                    <p>No tasks</p>
                  }
                </div>
              }
            </div>
          </div>

          <!-- In Progress Column -->
          <div
            class="bg-blue-50 rounded-lg p-4 transition-colors"
            [class.ring-2]="dragOverStatus === 1"
            [class.ring-blue-400]="dragOverStatus === 1"
            [class.bg-blue-100]="dragOverStatus === 1"
            (dragover)="onDragOverColumn($event, 1)"
            (dragleave)="onDragLeaveColumn()"
            (drop)="onDropOnColumn($event, 1)"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-blue-700">In Progress</h3>
              <span class="px-2 py-1 bg-blue-200 rounded-full text-sm">{{ taskStore.inProgressTasks().length }}</span>
            </div>
            <div class="space-y-3 min-h-[100px]">
              @for (task of taskStore.inProgressTasks(); track task.id) {
                <div
                  class="bg-white rounded-lg p-4 shadow-sm cursor-grab hover:shadow-md transition-all border-l-4 border-blue-500"
                  [class.opacity-50]="draggedTask?.id === task.id"
                  [class.scale-95]="draggedTask?.id === task.id"
                  (click)="showTaskDetail(task)"
                  draggable="true"
                  (dragstart)="onDragStart($event, task)"
                  (dragend)="onDragEnd()"
                >
                  <div class="flex items-start justify-between">
                    <h4 class="font-medium text-gray-800">{{ task.title }}</h4>
                    @if (task.priority === 3) {
                      <span class="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Critical</span>
                    }
                  </div>
                  @if (task.description) {
                    <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ task.description }}</p>
                  }
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center gap-2">
                      @if (task.storyPoints) {
                        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ task.storyPoints }} SP</span>
                      }
                      @if (task.dueDate) {
                        <span class="text-xs text-gray-500">{{ task.dueDate | date:'shortDate' }}</span>
                      }
                    </div>
                    @if (task.assignedToName) {
                      <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {{ getInitials(task.assignedToName) }}
                      </div>
                    }
                  </div>
                  @if (task.commentCount > 0 || task.attachmentCount > 0) {
                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      @if (task.commentCount > 0) {
                        <span><i class="pi pi-comments"></i> {{ task.commentCount }}</span>
                      }
                      @if (task.attachmentCount > 0) {
                        <span><i class="pi pi-paperclip"></i> {{ task.attachmentCount }}</span>
                      }
                    </div>
                  }
                </div>
              } @empty {
                <div
                  class="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center text-blue-400"
                  [class.border-blue-400]="dragOverStatus === 1"
                  [class.text-blue-500]="dragOverStatus === 1"
                  [class.bg-blue-50]="dragOverStatus === 1"
                >
                  @if (dragOverStatus === 1) {
                    <i class="pi pi-plus-circle text-2xl mb-2"></i>
                    <p>Drop here</p>
                  } @else {
                    <p>No tasks</p>
                  }
                </div>
              }
            </div>
          </div>

          <!-- In Review Column -->
          <div
            class="bg-yellow-50 rounded-lg p-4 transition-colors"
            [class.ring-2]="dragOverStatus === 2"
            [class.ring-yellow-400]="dragOverStatus === 2"
            [class.bg-yellow-100]="dragOverStatus === 2"
            (dragover)="onDragOverColumn($event, 2)"
            (dragleave)="onDragLeaveColumn()"
            (drop)="onDropOnColumn($event, 2)"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-yellow-700">In Review</h3>
              <span class="px-2 py-1 bg-yellow-200 rounded-full text-sm">{{ taskStore.inReviewTasks().length }}</span>
            </div>
            <div class="space-y-3 min-h-[100px]">
              @for (task of taskStore.inReviewTasks(); track task.id) {
                <div
                  class="bg-white rounded-lg p-4 shadow-sm cursor-grab hover:shadow-md transition-all border-l-4 border-yellow-500"
                  [class.opacity-50]="draggedTask?.id === task.id"
                  [class.scale-95]="draggedTask?.id === task.id"
                  (click)="showTaskDetail(task)"
                  draggable="true"
                  (dragstart)="onDragStart($event, task)"
                  (dragend)="onDragEnd()"
                >
                  <div class="flex items-start justify-between">
                    <h4 class="font-medium text-gray-800">{{ task.title }}</h4>
                    @if (task.priority === 3) {
                      <span class="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Critical</span>
                    }
                  </div>
                  @if (task.description) {
                    <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ task.description }}</p>
                  }
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center gap-2">
                      @if (task.storyPoints) {
                        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ task.storyPoints }} SP</span>
                      }
                      @if (task.dueDate) {
                        <span class="text-xs text-gray-500">{{ task.dueDate | date:'shortDate' }}</span>
                      }
                    </div>
                    @if (task.assignedToName) {
                      <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {{ getInitials(task.assignedToName) }}
                      </div>
                    }
                  </div>
                  @if (task.commentCount > 0 || task.attachmentCount > 0) {
                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      @if (task.commentCount > 0) {
                        <span><i class="pi pi-comments"></i> {{ task.commentCount }}</span>
                      }
                      @if (task.attachmentCount > 0) {
                        <span><i class="pi pi-paperclip"></i> {{ task.attachmentCount }}</span>
                      }
                    </div>
                  }
                </div>
              } @empty {
                <div
                  class="border-2 border-dashed border-yellow-300 rounded-lg p-8 text-center text-yellow-400"
                  [class.border-yellow-400]="dragOverStatus === 2"
                  [class.text-yellow-500]="dragOverStatus === 2"
                  [class.bg-yellow-50]="dragOverStatus === 2"
                >
                  @if (dragOverStatus === 2) {
                    <i class="pi pi-plus-circle text-2xl mb-2"></i>
                    <p>Drop here</p>
                  } @else {
                    <p>No tasks</p>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Done Column -->
          <div
            class="bg-green-50 rounded-lg p-4 transition-colors"
            [class.ring-2]="dragOverStatus === 3"
            [class.ring-green-400]="dragOverStatus === 3"
            [class.bg-green-100]="dragOverStatus === 3"
            (dragover)="onDragOverColumn($event, 3)"
            (dragleave)="onDragLeaveColumn()"
            (drop)="onDropOnColumn($event, 3)"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-green-700">Done</h3>
              <span class="px-2 py-1 bg-green-200 rounded-full text-sm">{{ taskStore.doneTasks().length }}</span>
            </div>
            <div class="space-y-3 min-h-[100px]">
              @for (task of taskStore.doneTasks(); track task.id) {
                <div
                  class="bg-white rounded-lg p-4 shadow-sm cursor-grab hover:shadow-md transition-all border-l-4 border-green-500"
                  [class.opacity-50]="draggedTask?.id === task.id"
                  [class.scale-95]="draggedTask?.id === task.id"
                  (click)="showTaskDetail(task)"
                  draggable="true"
                  (dragstart)="onDragStart($event, task)"
                  (dragend)="onDragEnd()"
                >
                  <div class="flex items-start justify-between">
                    <h4 class="font-medium text-gray-800">{{ task.title }}</h4>
                    @if (task.priority === 3) {
                      <span class="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Critical</span>
                    }
                  </div>
                  @if (task.description) {
                    <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ task.description }}</p>
                  }
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center gap-2">
                      @if (task.storyPoints) {
                        <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ task.storyPoints }} SP</span>
                      }
                      @if (task.dueDate) {
                        <span class="text-xs text-gray-500">{{ task.dueDate | date:'shortDate' }}</span>
                      }
                    </div>
                    @if (task.assignedToName) {
                      <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {{ getInitials(task.assignedToName) }}
                      </div>
                    }
                  </div>
                  @if (task.commentCount > 0 || task.attachmentCount > 0) {
                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      @if (task.commentCount > 0) {
                        <span><i class="pi pi-comments"></i> {{ task.commentCount }}</span>
                      }
                      @if (task.attachmentCount > 0) {
                        <span><i class="pi pi-paperclip"></i> {{ task.attachmentCount }}</span>
                      }
                    </div>
                  }
                </div>
              } @empty {
                <div
                  class="border-2 border-dashed border-green-300 rounded-lg p-8 text-center text-green-400"
                  [class.border-green-400]="dragOverStatus === 3"
                  [class.text-green-500]="dragOverStatus === 3"
                  [class.bg-green-50]="dragOverStatus === 3"
                >
                  @if (dragOverStatus === 3) {
                    <i class="pi pi-plus-circle text-2xl mb-2"></i>
                    <p>Drop here</p>
                  } @else {
                    <p>No tasks</p>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Create Task Dialog -->
    <p-dialog
      [(visible)]="createDialogVisible"
      header="Create Task"
      [modal]="true"
      [style]="{ width: '500px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium">Title *</label>
          <input pInputText [(ngModel)]="newTask.title" class="w-full" placeholder="Task title" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">Description</label>
          <textarea pInputTextarea [(ngModel)]="newTask.description" class="w-full" rows="3" placeholder="Task description..."></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium">Priority</label>
            <p-select
              [options]="priorityOptions"
              [(ngModel)]="newTask.priority"
              optionLabel="label"
              optionValue="value"
              styleClass="w-full"
            ></p-select>
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium">Story Points</label>
            <input pInputText [(ngModel)]="newTask.storyPoints" type="number" class="w-full" placeholder="0" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">Due Date</label>
          <input pInputText [(ngModel)]="newTask.dueDate" type="date" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">Assign To</label>
          <p-select
            [options]="members"
            [(ngModel)]="newTask.assignedToId"
            optionLabel="fullName"
            optionValue="userId"
            placeholder="Select member"
            styleClass="w-full"
            [showClear]="true"
          ></p-select>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" styleClass="p-button-text" (onClick)="createDialogVisible = false"></p-button>
        <p-button label="Create" (onClick)="createTask()" [loading]="isSaving"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class TaskBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private translationService = inject(TranslationService);

  t = this.translationService.translate.bind(this.translationService);

  taskStore = inject(TaskStore);
  projectService = inject(ProjectService);

  projectId = '';
  projectName = '';
  members: ProjectMember[] = [];
  searchTerm = '';
  createDialogVisible = false;
  isSaving = false;

  draggedTask: Task | null = null;
  dragOverStatus: number | null = null;

  newTask = {
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
      this.loadProject();
      this.loadMembers();
      this.taskStore.loadTasksByProject(this.projectId);
    }
  }

  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.projectName = response.data.name;
        }
      }
    });
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

  showTaskDetail(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }

  showCreateDialog(): void {
    this.newTask = {
      title: '',
      description: '',
      priority: 1,
      storyPoints: undefined,
      dueDate: undefined,
      assignedToId: undefined
    };
    this.createDialogVisible = true;
  }

  async createTask(): Promise<void> {
    if (!this.newTask.title.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Task title is required'
      });
      return;
    }

    this.isSaving = true;
    const success = await this.taskStore.createTask(this.projectId, {
      ...this.newTask,
      dueDate: this.newTask.dueDate ? new Date(this.newTask.dueDate) : undefined
    });
    this.isSaving = false;

    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Task created successfully'
      });
      this.createDialogVisible = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create task'
      });
    }
  }

  // Drag and Drop handlers
  onDragStart(event: DragEvent, task: Task): void {
    this.draggedTask = task;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', task.id);
    }
  }

  onDragEnd(): void {
    this.draggedTask = null;
    this.dragOverStatus = null;
  }

  onDragOverColumn(event: DragEvent, status: number): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverStatus = status;
  }

  onDragLeaveColumn(): void {
    this.dragOverStatus = null;
  }

  async onDropOnColumn(event: DragEvent, newStatus: number): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverStatus = null;

    if (this.draggedTask && this.draggedTask.status !== newStatus) {
      const success = await this.taskStore.changeStatus(this.draggedTask.id, newStatus, this.projectId);
      if (success) {
        const statusNames = ['Todo', 'In Progress', 'In Review', 'Done', 'Cancelled'];
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Task moved to ${statusNames[newStatus]}`
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task status'
        });
      }
    }
    this.draggedTask = null;
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
