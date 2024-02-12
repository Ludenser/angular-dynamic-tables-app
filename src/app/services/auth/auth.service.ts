import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export type User = {
  id: number;
  username: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.authState.asObservable();

  constructor(private http: HttpClient) { this.setLoading(false); }

  setLoading(isLoading: boolean) {
    this.authState.next(isLoading);
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${environment.apiUrl}/login`;
    this.setLoading(true);
    return this.http.post<User>(url, { username, password })
      .pipe(
        map(user => {
          if (user && user.id) {
            localStorage.setItem('user', JSON.stringify(user));
            this.setLoading(false);
            return true;
          } else {
            this.setLoading(false);
            return false;
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          this.setLoading(false);
          return throwError(() => new Error(error.error.message));
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.setLoading(false);
  }

  changePassword(username: string, oldPassword: string, newPassword: string): Observable<boolean> {
    this.setLoading(true);
    return this.http.post<any>(`${environment.apiUrl}/change-password`, { username, oldPassword, newPassword })
      .pipe(
        catchError(error => {
          this.setLoading(false);
          console.error('Change password error:', error);
          return throwError(() => new Error(error.error.message));
        })
      );
  }

  get isAuthorized() {
    const user = localStorage.getItem('user');
    const isAuth = !!user;
    this.authState.next(isAuth);
    return this.authState.asObservable();
  }
}
