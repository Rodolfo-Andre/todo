import { Injectable, signal } from '@angular/core';

export type Language = 'es' | 'en';

export interface TranslationData {
  [key: string]: string | TranslationData;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = signal<Language>('es');
  private translations = signal<TranslationData>({});
  private loaded = signal<boolean>(false);

  language = this.currentLanguage.asReadonly();
  isLoaded = this.loaded.asReadonly();

  constructor() {
    const savedLang = localStorage.getItem('language') as Language;
    const lang = savedLang && (savedLang === 'es' || savedLang === 'en') ? savedLang : 'es';
    this.loadLanguage(lang);
  }

  async loadLanguage(lang: Language): Promise<void> {
    try {
      const response = await this.fetchTranslations(lang);
      if (response) {
        this.translations.set(response);
        this.currentLanguage.set(lang);
        this.loaded.set(true);
        localStorage.setItem('language', lang);
      }
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      // Try to load Spanish as fallback
      if (lang !== 'es') {
        try {
          const response = await this.fetchTranslations('es');
          if (response) {
            this.translations.set(response);
            this.currentLanguage.set('es');
            this.loaded.set(true);
            localStorage.setItem('language', 'es');
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
        }
      }
    }
  }

  private async fetchTranslations(lang: Language): Promise<TranslationData | null> {
    const response = await fetch(`/assets/i18n/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations: ${response.status}`);
    }
    return response.json();
  }

  setLanguage(lang: Language): void {
    this.loaded.set(false);
    this.loadLanguage(lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  translate(key: string, params?: Record<string, string | number>): string {
    if (!this.loaded()) {
      return key;
    }

    const keys = key.split('.');
    let result: string | TranslationData = this.translations();

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as TranslationData)[k];
      } else {
        return key;
      }
    }

    if (typeof result !== 'string') {
      return key;
    }

    if (params) {
      return this.interpolate(result, params);
    }

    return result;
  }

  private interpolate(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return params[key] !== undefined ? String(params[key]) : `{{${key}}}`;
    });
  }

  getLanguageName(lang: Language): string {
    return lang === 'es' ? 'Español' : 'English';
  }

  getAvailableLanguages(): { code: Language; name: string }[] {
    return [
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'English' }
    ];
  }
}
