import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Settings</h1>

      <p-card>
        <p class="text-gray-500">Application settings will be displayed here.</p>
      </p-card>
    </div>
  `
})
export class SettingsComponent {}
