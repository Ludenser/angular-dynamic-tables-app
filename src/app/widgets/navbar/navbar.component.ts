import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { LayoutService } from '../../layout/layout.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'showcase-navbar',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzLayoutModule, LanguageSwitcherComponent, UserProfileComponent, NzDividerModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() isLoginPage: boolean = true;
  constructor(private layoutService: LayoutService) { }
  get isCollapsed$() {
    return this.layoutService.isCollapsed$;
  }
  toggleCollapse() {
    this.layoutService.toggleCollapse();
  }
}
