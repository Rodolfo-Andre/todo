import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Projects</h1>
        <p-button label="New Project" icon="pi pi-plus"></p-button>
      </div>

      <p-card>
        <p class="text-gray-500">Project list will be displayed here.</p>
      </p-card>
    </div>
  `
})
export class ProjectListComponent {}
