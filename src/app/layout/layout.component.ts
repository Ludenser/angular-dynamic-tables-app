import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NavbarComponent } from '../widgets/navbar/navbar.component';
import { SidebarComponent } from '../widgets/sidebar/sidebar.component';
import { LayoutService } from './layout.service';

@Component({
  selector: 'showcase-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NzIconModule, NzLayoutModule, NzMenuModule, NavbarComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isLoginPage: boolean = true;

  constructor(private layoutService: LayoutService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = !this.router.url.includes('login');
      }
    });
  }
  get isCollapsed$() {
    return this.layoutService.isCollapsed$;
  }
}
