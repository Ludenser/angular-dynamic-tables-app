import { Routes } from '@angular/router';
import { DynamicTableComponent } from './features/dynamic-table/dynamic-table.component';
import { LoginComponent } from './features/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { canActivate } from './services/auth/auth.guard';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      {
        path: 'home', canActivate: [canActivate], children: [
          { path: ':section/:subsection', component: DynamicTableComponent },
          { path: ':section', component: DynamicTableComponent },
          { path: '', redirectTo: 'orders/completed', pathMatch: 'full' }
        ]
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
  }
];
