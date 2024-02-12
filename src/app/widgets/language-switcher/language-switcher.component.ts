import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { LocalizationService } from '../../services/localization/localization.service';


@Component({
  selector: 'showcase-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  standalone: true,
  imports: [NzDropDownModule, NzMenuModule, CommonModule]
})
export class LanguageSwitcherComponent {
  currentLanguage: string;

  constructor(private localizationService: LocalizationService) {
    this.currentLanguage = this.localizationService.getCurrentLanguage();
  }

  public get languages() {
    return this.localizationService.getLanguages();
  }

  changeLanguage(languageCode: string): void {
    this.localizationService.setLocale(languageCode);
    this.currentLanguage = this.localizationService.getCurrentLanguage();
  }

  getCurrentFlagUrl(): string {
    return this.localizationService.getCurrentFlagUrl();
  }
}
