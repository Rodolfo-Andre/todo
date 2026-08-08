import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuditService, AuditLog, AuditLogSummary } from './audit.service';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    TagModule,
    TooltipModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">{{ t('audit.title') }}</h1>
        <p-button [label]="t('common.refresh')" icon="pi pi-refresh" (onClick)="loadData()" [loading]="isLoading"></p-button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <p-card styleClass="text-center">
          <div class="text-3xl font-bold text-blue-500">{{ summary?.totalLogs || 0 }}</div>
          <div class="text-sm text-gray-500">{{ t('audit.totalLogs') }}</div>
        </p-card>
        <p-card styleClass="text-center">
          <div class="text-3xl font-bold text-green-500">{{ summary?.todayLogs || 0 }}</div>
          <div class="text-sm text-gray-500">{{ t('audit.todayLogs') }}</div>
        </p-card>
        <p-card styleClass="text-center">
          <div class="text-3xl font-bold text-purple-500">{{ getObjectKeys(summary?.logsByAction || {}).length }}</div>
          <div class="text-sm text-gray-500">{{ t('audit.actionTypes') }}</div>
        </p-card>
        <p-card styleClass="text-center">
          <div class="text-3xl font-bold text-orange-500">{{ getObjectKeys(summary?.logsByEntity || {}).length }}</div>
          <div class="text-sm text-gray-500">{{ t('audit.entityTypes') }}</div>
        </p-card>
      </div>

      <!-- Filters -->
      <p-card>
        <ng-template pTemplate="header">
          <div class="px-4 py-3 border-b">
            <h2 class="text-lg font-semibold">{{ t('audit.filters') }}</h2>
          </div>
        </ng-template>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">{{ t('audit.action') }}</label>
            <p-select
              [options]="actionOptions"
              [(ngModel)]="filters.action"
              optionLabel="label"
              optionValue="value"
              [placeholder]="t('audit.allActions')"
              styleClass="w-full"
              [showClear]="true"
            ></p-select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">{{ t('audit.entity') }}</label>
            <p-select
              [options]="entityOptions"
              [(ngModel)]="filters.entityName"
              optionLabel="label"
              optionValue="value"
              [placeholder]="t('audit.allEntities')"
              styleClass="w-full"
              [showClear]="true"
            ></p-select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">{{ t('audit.startDate') }}</label>
            <p-datepicker [(ngModel)]="filters.startDate" [showIcon]="true" [placeholder]="t('audit.startDate')" styleClass="w-full"></p-datepicker>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm">{{ t('audit.endDate') }}</label>
            <p-datepicker [(ngModel)]="filters.endDate" [showIcon]="true" [placeholder]="t('audit.endDate')" styleClass="w-full"></p-datepicker>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <p-button [label]="t('audit.applyFilters')" icon="pi pi-filter" (onClick)="applyFilters()"></p-button>
        </div>
      </p-card>

      <!-- Audit Logs Table -->
      <p-card>
        <p-table
          [value]="logs"
          [loading]="isLoading"
          [paginator]="true"
          [rows]="20"
          [showCurrentPageReport]="true"
          [currentPageReportTemplate]="t('audit.paginationInfo')"
          [rowsPerPageOptions]="[10, 20, 50]"
          [tableStyle]="{ 'min-width': '48rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>{{ t('audit.date') }}</th>
              <th>{{ t('audit.user') }}</th>
              <th>{{ t('audit.action') }}</th>
              <th>{{ t('audit.entity') }}</th>
              <th>{{ t('audit.entityId') }}</th>
              <th>{{ t('common.details') }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-log>
            <tr>
              <td>{{ log.createdAt | date:'medium' }}</td>
              <td>{{ log.userName || t('audit.system') }}</td>
              <td>
                <p-tag [value]="log.action" [severity]="getActionSeverity(log.action)"></p-tag>
              </td>
              <td>{{ log.entityName }}</td>
              <td>
                <span class="text-sm font-mono text-gray-600">{{ log.entityId | slice:0:8 }}...</span>
              </td>
              <td>
                <p-button
                  icon="pi pi-eye"
                  styleClass="p-button-text p-button-rounded p-button-sm"
                  (onClick)="showDetails(log)"
                  [pTooltip]="t('audit.viewDetails')"
                ></p-button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-8">
                <div class="flex flex-col items-center gap-4">
                  <i class="pi pi-history text-4xl text-gray-300"></i>
                  <p class="text-gray-500">{{ t('audit.noLogs') }}</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `
})
export class AuditLogListComponent implements OnInit {
  private auditService = inject(AuditService);
  private messageService = inject(MessageService);
  private translationService = inject(TranslationService);

  t = this.translationService.translate.bind(this.translationService);

  logs: AuditLog[] = [];
  summary: AuditLogSummary | null = null;
  isLoading = false;

  filters = {
    action: null as string | null,
    entityName: null as string | null,
    startDate: null as Date | null,
    endDate: null as Date | null
  };

  get actionOptions(): { label: string; value: string }[] {
    return [
      { label: this.t('audit.create'), value: 'Create' },
      { label: this.t('audit.update'), value: 'Update' },
      { label: this.t('audit.delete'), value: 'Delete' },
      { label: this.t('audit.login'), value: 'Login' },
      { label: this.t('audit.logout'), value: 'Logout' }
    ];
  }

  get entityOptions(): { label: string; value: string }[] {
    return [
      { label: this.t('audit.entityProject'), value: 'Project' },
      { label: this.t('audit.entityTask'), value: 'Task' },
      { label: this.t('audit.entityUser'), value: 'User' },
      { label: this.t('audit.entityComment'), value: 'Comment' },
      { label: this.t('audit.entityAttachment'), value: 'Attachment' }
    ];
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    this.auditService.getAuditLogs({
      action: this.filters.action || undefined,
      entityName: this.filters.entityName || undefined,
      startDate: this.filters.startDate || undefined,
      endDate: this.filters.endDate || undefined
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.logs = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.t('common.error'),
          detail: this.t('audit.loadFailed')
        });
        this.isLoading = false;
      }
    });

    this.auditService.getAuditSummary().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.summary = response.data;
        }
      }
    });
  }

  applyFilters(): void {
    this.loadData();
  }

  getActionSeverity(action: string): string {
    switch (action) {
      case 'Create': return 'success';
      case 'Update': return 'info';
      case 'Delete': return 'danger';
      case 'Login': return 'warn';
      default: return 'secondary';
    }
  }

  getObjectKeys(obj: Record<string, number>): string[] {
    return Object.keys(obj);
  }

  showDetails(log: AuditLog): void {
    let details = `${this.t('audit.action')}: ${log.action}\n${this.t('audit.entity')}: ${log.entityName}\n${this.t('audit.entityId')}: ${log.entityId}\n${this.t('audit.date')}: ${log.createdAt}`;

    if (log.oldValues) {
      details += `\n\n${this.t('audit.oldValues')}:\n${log.oldValues}`;
    }
    if (log.newValues) {
      details += `\n\n${this.t('audit.newValues')}:\n${log.newValues}`;
    }

    alert(details);
  }
}
