import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProjectService, Project } from './project.service';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="space-y-6">
      <div class="page-header">
        <h1 class="text-2xl font-bold">{{ t('projects.title') }}</h1>
        <p-button [label]="t('projects.createProject')" icon="pi pi-plus" styleClass="w-full sm:w-auto" (onClick)="showCreateDialog()"></p-button>
      </div>

      <p-card>
        <p-table [value]="projects" [loading]="isLoading" [tableStyle]="{ 'min-width': '42rem' }">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ t('projects.title') }}</th>
              <th>{{ t('projects.projectKey') }}</th>
              <th>{{ t('projects.tasks') }}</th>
              <th>{{ t('projects.members') }}</th>
              <th>{{ t('projects.status') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-project>
            <tr>
              <td>
                <a [routerLink]="['/projects', project.id]" class="font-medium text-blue-600 hover:underline">
                  {{ project.name }}
                </a>
                @if (project.description) {
                  <p class="text-sm text-gray-500 mt-1">{{ project.description | slice:0:50 }}{{ project.description.length > 50 ? '...' : '' }}</p>
                }
              </td>
              <td>
                <span class="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{{ project.key }}</span>
              </td>
              <td>{{ project.taskCount }}</td>
              <td>{{ project.memberCount }}</td>
              <td>
                <p-tag [value]="getStatusLabel(project.status)" [severity]="getStatusSeverity(project.status)"></p-tag>
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button icon="pi pi-pencil" styleClass="p-button-text p-button-rounded" (onClick)="showEditDialog(project)"></p-button>
                  <p-button icon="pi pi-trash" styleClass="p-button-text p-button-rounded p-button-danger" (onClick)="confirmDelete(project)"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-8">
                <div class="flex flex-col items-center gap-4">
                  <i class="pi pi-folder-open text-4xl text-gray-300"></i>
                  <p class="text-gray-500">{{ t('projects.noProjects') }}</p>
                  <p-button [label]="t('projects.createFirst')" icon="pi pi-plus" (onClick)="showCreateDialog()"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <!-- Create/Edit Dialog -->
    <p-dialog
      [(visible)]="dialogVisible"
      [header]="isEditMode ? t('projects.editProject') : t('projects.createProject')"
      [modal]="true"
      [style]="{ width: 'min(90vw, 500px)' }"
      [draggable]="false"
      [resizable]="false"
    >
      <form [formGroup]="projectForm" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium">{{ t('projects.projectName') }} *</label>
          <input pInputText id="name" formControlName="name" class="w-full" />
        </div>

        @if (!isEditMode) {
          <div class="flex flex-col gap-2">
            <label for="key" class="font-medium">{{ t('projects.projectKey') }} *</label>
            <input pInputText id="key" formControlName="key" class="w-full" maxlength="10" style="text-transform: uppercase;" />
            <small class="text-gray-500">{{ t('projects.keyHelpText') }}</small>
          </div>
        }

        <div class="flex flex-col gap-2">
          <label for="description" class="font-medium">{{ t('projects.description') }}</label>
          <textarea pInputTextarea id="description" formControlName="description" class="w-full" rows="3"></textarea>
        </div>
      </form>

      <ng-template pTemplate="footer">
        <p-button [label]="t('common.cancel')" styleClass="p-button-text" (onClick)="hideDialog()"></p-button>
        <p-button [label]="isEditMode ? t('common.save') : t('common.create')" (onClick)="saveProject()" [loading]="isSaving"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);
  t = this.translationService.translate.bind(this.translationService);

  projects: Project[] = [];
  isLoading = false;
  isSaving = false;

  dialogVisible = false;
  isEditMode = false;
  selectedProject: Project | null = null;

  projectForm: FormGroup;

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      key: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern('^[A-Z0-9]+$')]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getProjects().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.projects = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.t('common.error'),
          detail: this.t('projects.loadFailed')
        });
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return this.t('projects.active');
      case 1: return this.t('projects.archived');
      default: return this.t('common.pending');
    }
  }

  getStatusSeverity(status: number): string {
    switch (status) {
      case 0: return 'success';
      case 1: return 'secondary';
      default: return 'secondary';
    }
  }

  showCreateDialog(): void {
    this.isEditMode = false;
    this.selectedProject = null;
    this.projectForm.reset({ name: '', key: '', description: '' });
    this.dialogVisible = true;
  }

  showEditDialog(project: Project): void {
    this.isEditMode = true;
    this.selectedProject = project;
    this.projectForm.patchValue({
      name: project.name,
      key: project.key,
      description: project.description || ''
    });
    this.dialogVisible = true;
  }

  hideDialog(): void {
    this.dialogVisible = false;
    this.projectForm.reset();
  }

  saveProject(): void {
    if (this.projectForm.invalid) return;

    this.isSaving = true;

    if (this.isEditMode && this.selectedProject) {
      this.projectService.updateProject(this.selectedProject.id, this.projectForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: this.t('common.success'),
              detail: this.t('projects.projectUpdated')
            });
            this.loadProjects();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: this.t('common.error'),
              detail: response.errors?.[0] || this.t('projects.updateFailed')
            });
          }
          this.isSaving = false;
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.t('common.error'),
            detail: this.t('projects.updateFailed')
          });
          this.isSaving = false;
        }
      });
    } else {
      this.projectService.createProject(this.projectForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: this.t('common.success'),
              detail: this.t('projects.projectCreated')
            });
            this.loadProjects();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: this.t('common.error'),
              detail: response.errors?.[0] || this.t('projects.createFailed')
            });
          }
          this.isSaving = false;
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.t('common.error'),
            detail: this.t('projects.createFailed')
          });
          this.isSaving = false;
        }
      });
    }
  }

  confirmDelete(project: Project): void {
    this.confirmationService.confirm({
      message: this.t('projects.confirmDelete'),
      header: this.t('common.confirm'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteProject(project.id);
      }
    });
  }

  deleteProject(id: string): void {
    this.projectService.deleteProject(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: this.t('common.success'),
            detail: this.t('projects.projectDeleted')
          });
          this.loadProjects();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.t('common.error'),
            detail: response.errors?.[0] || this.t('projects.deleteFailed')
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.t('common.error'),
          detail: this.t('projects.deleteFailed')
        });
      }
    });
  }
}
