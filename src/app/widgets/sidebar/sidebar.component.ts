import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { LayoutService } from '../../layout/layout.service';
import { PathManagementService, Paths } from '../../services/path-manager/path-manager.service';

@Component({
  selector: 'showcase-sidebar',
  standalone: true,
  imports: [RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, CommonModule, NzToolTipModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  paths!: Paths;
  isCollapsed$ = this.layoutService.isCollapsed$;

  constructor(private layoutService: LayoutService, private pathService: PathManagementService) { }

  ngOnInit() {
    this.paths = this.pathService.getAllPaths();
  }
}
