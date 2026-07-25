import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, CardModule, TabViewModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Project Detail</h1>

      <p-tabView>
        <p-tabPanel header="Board">
          <p class="text-gray-500">Kanban board will be displayed here.</p>
        </p-tabPanel>
        <p-tabPanel header="List">
          <p class="text-gray-500">Task list will be displayed here.</p>
        </p-tabPanel>
        <p-tabPanel header="Members">
          <p class="text-gray-500">Project members will be displayed here.</p>
        </p-tabPanel>
        <p-tabPanel header="Settings">
          <p class="text-gray-500">Project settings will be displayed here.</p>
        </p-tabPanel>
      </p-tabView>
    </div>
  `
})
export class ProjectDetailComponent {}
