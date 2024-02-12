import { Injectable } from '@angular/core';
import { NzI18nService, en_US, ru_RU } from 'ng-zorro-antd/i18n';

interface Language {
  name: string;
  code: string;
  flagUrl: string;
  nzI18nLocale: any;
}

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private currentLanguage: string = 'en';
  private languages: Language[] = [
    { name: 'Eng', code: 'en', flagUrl: '/assets/icons/en_flag.svg', nzI18nLocale: en_US },
    { name: 'Рус', code: 'ru', flagUrl: '/assets/icons/ru_flag.svg', nzI18nLocale: ru_RU }
  ];

  constructor(private i18n: NzI18nService) {
    this.setLocale(this.currentLanguage);
  }

  getLanguages(): Language[] {
    return this.languages;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getCurrentFlagUrl(): string {
    const currentLang = this.languages.find(lang => lang.code === this.currentLanguage);
    return currentLang ? currentLang.flagUrl : '/assets/flags/default.svg';
  }

  setLocale(languageCode: string): void {
    const language = this.languages.find(lang => lang.code === languageCode);
    if (language) {
      this.currentLanguage = languageCode;
      this.i18n.setLocale(language.nzI18nLocale);
    }
  }
}
