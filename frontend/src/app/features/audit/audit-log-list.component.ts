import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Audit Logs</h1>

      <p-card>
        <p class="text-gray-500">Audit logs will be displayed here.</p>
      </p-card>
    </div>
  `
})
export class AuditLogListComponent {}
