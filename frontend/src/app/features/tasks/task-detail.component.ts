import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, CardModule, TabViewModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Task Detail</h1>

      <p-card>
        <p class="text-gray-500">Task details will be displayed here.</p>
      </p-card>
    </div>
  `
})
export class TaskDetailComponent {}
