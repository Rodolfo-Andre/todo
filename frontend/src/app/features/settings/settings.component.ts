import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">{{ t('settings.title') }}</h1>

      <p-card>
        <p class="text-gray-500">{{ t('settings.comingSoon') }}</p>
      </p-card>
    </div>
  `
})
export class SettingsComponent {
  private translationService = inject(TranslationService);
  t = this.translationService.translate.bind(this.translationService);
}
