import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const canActivate: () => Observable<boolean | UrlTree> = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthorized.pipe(
    map(isAuth => {
      if (!isAuth) {
        return router.parseUrl('/login');
      }
      return true;
    })
  );
};
