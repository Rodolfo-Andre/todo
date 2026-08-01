import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  language = this.currentLanguage.asReadonly();

  constructor(private http: HttpClient) {
    this.loadLanguage('es');
  }

  async loadLanguage(lang: Language): Promise<void> {
    try {
      const response = await this.http.get<TranslationData>(`/assets/i18n/${lang}.json`).toPromise();
      if (response) {
        this.translations.set(response);
        this.currentLanguage.set(lang);
        localStorage.setItem('language', lang);
      }
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  }

  setLanguage(lang: Language): void {
    this.loadLanguage(lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  translate(key: string, params?: Record<string, string | number>): string {
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
