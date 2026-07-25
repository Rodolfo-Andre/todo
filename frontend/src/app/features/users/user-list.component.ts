import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Users</h1>
        <p-button label="Add User" icon="pi pi-plus"></p-button>
      </div>

      <p-card>
        <p class="text-gray-500">User list will be displayed here.</p>
      </p-card>
    </div>
  `
})
export class UserListComponent {}
