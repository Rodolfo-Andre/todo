import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslationService, Language } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, ButtonModule, DropdownModule, FormsModule],
  template: `
    <div class="flex items-center gap-2">
      <p-dropdown
        [options]="languages"
        [(ngModel)]="selectedLanguage"
        optionLabel="name"
        optionValue="code"
        (onChange)="onLanguageChange($event.value)"
        styleClass="w-full"
      ></p-dropdown>
    </div>
  `
})
export class LanguageSwitcherComponent {
  private translationService = inject(TranslationService);

  languages = this.translationService.getAvailableLanguages();
  selectedLanguage: Language = this.translationService.language();

  onLanguageChange(lang: Language): void {
    this.translationService.setLanguage(lang);
  }
}
