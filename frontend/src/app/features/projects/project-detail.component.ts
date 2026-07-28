import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProjectService, Project, ProjectMember } from './project.service';
import { UserService } from '../users/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    TableModule,
    DialogModule,
    SelectModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <p-button icon="pi pi-arrow-left" styleClass="p-button-text" routerLink="/projects"></p-button>
          <h1 class="text-2xl font-bold">{{ project?.name || 'Loading...' }}</h1>
          @if (project) {
            <span class="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{{ project.key }}</span>
          }
        </div>
        <div class="flex gap-2">
          <p-button label="Edit" icon="pi pi-pencil" (onClick)="showEditDialog()"></p-button>
        </div>
      </div>

      @if (isLoading) {
        <p-card>
          <div class="text-center py-8">
            <i class="pi pi-spin pi-spinner text-2xl"></i>
            <p class="mt-2 text-gray-500">Loading project...</p>
          </div>
        </p-card>
      } @else if (project) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Project Info -->
          <p-card styleClass="lg:col-span-2">
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b">
                <h2 class="text-lg font-semibold">Project Information</h2>
              </div>
            </ng-template>

            <div class="flex flex-col gap-4">
              <div>
                <p class="text-sm text-gray-500 mb-1">Description</p>
                <p>{{ project.description || 'No description provided' }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Status</p>
                  <p-tag [value]="getStatusLabel(project.status)" [severity]="getStatusSeverity(project.status)"></p-tag>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Created</p>
                  <p>{{ project.createdAt | date:'mediumDate' }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Total Tasks</p>
                  <p class="text-2xl font-bold">{{ project.taskCount }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Team Members</p>
                  <p class="text-2xl font-bold">{{ project.memberCount }}</p>
                </div>
              </div>
            </div>
          </p-card>

          <!-- Members -->
          <p-card>
            <ng-template pTemplate="header">
              <div class="px-4 py-3 border-b flex justify-between items-center">
                <h2 class="text-lg font-semibold">Members</h2>
                <p-button icon="pi pi-plus" styleClass="p-button-text p-button-rounded p-button-sm" (onClick)="showAddMemberDialog()"></p-button>
              </div>
            </ng-template>

            <div class="flex flex-col gap-3">
              @for (member of members; track member.id) {
                <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {{ getInitials(member.fullName) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ member.fullName }}</p>
                      <p class="text-xs text-gray-500">{{ getRoleLabel(member.projectRole) }}</p>
                    </div>
                  </div>
                  <button pButton icon="pi pi-times" class="p-button-text p-button-rounded p-button-sm p-button-danger" (click)="confirmRemoveMember(member)"></button>
                </div>
              } @empty {
                <p class="text-center text-gray-500 py-4">No members yet</p>
              }
            </div>
          </p-card>
        </div>
      } @else {
        <p-card>
          <div class="text-center py-8">
            <p class="text-gray-500">Project not found.</p>
          </div>
        </p-card>
      }
    </div>

    <!-- Edit Project Dialog -->
    <p-dialog
      [(visible)]="editDialogVisible"
      header="Edit Project"
      [modal]="true"
      [style]="{ width: '500px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <form [formGroup]="editForm" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium">Project Name *</label>
          <input pInputText id="name" formControlName="name" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="description" class="font-medium">Description</label>
          <textarea pInputTextarea id="description" formControlName="description" class="w-full" rows="3"></textarea>
        </div>
      </form>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" styleClass="p-button-text" (onClick)="editDialogVisible = false"></p-button>
        <p-button label="Save" (onClick)="saveProject()" [loading]="isSaving"></p-button>
      </ng-template>
    </p-dialog>

    <!-- Add Member Dialog -->
    <p-dialog
      [(visible)]="addMemberDialogVisible"
      header="Add Member"
      [modal]="true"
      [style]="{ width: '400px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium">Select User</label>
          <p-select
            [options]="availableUsers"
            [(ngModel)]="selectedUserId"
            optionLabel="fullName"
            optionValue="id"
            placeholder="Select a user"
            styleClass="w-full"
            filter
            filterBy="fullName,email"
          ></p-select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">Role</label>
          <p-select
            [options]="roleOptions"
            [(ngModel)]="selectedRole"
            optionLabel="label"
            optionValue="value"
            styleClass="w-full"
          ></p-select>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" styleClass="p-button-text" (onClick)="addMemberDialogVisible = false"></p-button>
        <p-button label="Add" (onClick)="addMember()" [loading]="isAddingMember" [disabled]="!selectedUserId"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  project: Project | null = null;
  members: ProjectMember[] = [];
  availableUsers: User[] = [];
  isLoading = false;
  isSaving = false;
  isAddingMember = false;

  editDialogVisible = false;
  addMemberDialogVisible = false;
  editForm: FormGroup;

  selectedUserId: string = '';
  selectedRole: number = 1;

  roleOptions = [
    { label: 'Admin', value: 0 },
    { label: 'Member', value: 1 },
    { label: 'Viewer', value: 2 }
  ];

  constructor() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(id);
      this.loadMembers(id);
      this.loadUsers();
    }
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.projectService.getProjectById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.project = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load project'
        });
        this.isLoading = false;
      }
    });
  }

  loadMembers(id: string): void {
    this.projectService.getProjectMembers(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.members = response.data;
        }
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.availableUsers = response.data;
        }
      }
    });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Active';
      case 1: return 'Archived';
      default: return 'Unknown';
    }
  }

  getStatusSeverity(status: number): string {
    switch (status) {
      case 0: return 'success';
      case 1: return 'secondary';
      default: return 'secondary';
    }
  }

  getRoleLabel(role: number): string {
    switch (role) {
      case 0: return 'Admin';
      case 1: return 'Member';
      case 2: return 'Viewer';
      default: return 'Unknown';
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  showEditDialog(): void {
    if (this.project) {
      this.editForm.patchValue({
        name: this.project.name,
        description: this.project.description || ''
      });
      this.editDialogVisible = true;
    }
  }

  showAddMemberDialog(): void {
    this.selectedUserId = '';
    this.selectedRole = 1;
    this.addMemberDialogVisible = true;
  }

  saveProject(): void {
    if (this.editForm.invalid || !this.project) return;

    this.isSaving = true;
    this.projectService.updateProject(this.project.id, this.editForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project updated successfully'
          });
          this.loadProject(this.project!.id);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.errors?.[0] || 'Failed to update project'
          });
        }
        this.isSaving = false;
        this.editDialogVisible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update project'
        });
        this.isSaving = false;
      }
    });
  }

  addMember(): void {
    if (!this.selectedUserId || !this.project) return;

    this.isAddingMember = true;
    this.projectService.addMember(this.project.id, {
      userId: this.selectedUserId,
      projectRole: this.selectedRole
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Member added successfully'
          });
          this.loadMembers(this.project!.id);
          this.loadProject(this.project!.id);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.errors?.[0] || 'Failed to add member'
          });
        }
        this.isAddingMember = false;
        this.addMemberDialogVisible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add member'
        });
        this.isAddingMember = false;
      }
    });
  }

  confirmRemoveMember(member: ProjectMember): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove ${member.fullName} from this project?`,
      header: 'Confirm Remove',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.removeMember(member.userId);
      }
    });
  }

  removeMember(userId: string): void {
    if (!this.project) return;

    this.projectService.removeMember(this.project.id, userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Member removed successfully'
          });
          this.loadMembers(this.project!.id);
          this.loadProject(this.project!.id);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.errors?.[0] || 'Failed to remove member'
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove member'
        });
      }
    });
  }
}
