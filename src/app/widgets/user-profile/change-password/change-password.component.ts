import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AuthService, User } from '../../../services/auth/auth.service';
import Validation from '../../../shared/utils/validation';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [ReactiveFormsModule, NzFormModule, NzButtonModule, NzInputModule, NzAlertModule, CommonModule],
  standalone: true
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  user: User;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading$ = this.authService.isLoading$;

  constructor(private modalRef: NzModalRef, private authService: AuthService) {
    const user = localStorage.getItem('user');
    this.user = user ? JSON.parse(user) : {};
    this.authService.setLoading(false);
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm: new FormControl('', [Validators.required]),
    }, { validators: Validation.match('password', 'confirm') });
  }

  get passwordMismatchError(): boolean | undefined {
    return this.changePasswordForm.hasError('matching') && this.changePasswordForm.get('confirm')?.touched;
  }

  get passwordErrorTip(): string {
    if (this.changePasswordForm.get('password')?.hasError('required')) {
      return 'Пароль обязателен.';
    } else if (this.changePasswordForm.get('password')?.hasError('minlength')) {
      return 'Пароль должен содержать минимум 6 символов.';
    }
    return '';
  }

  get confirmErrorTip(): string {
    if (this.passwordMismatchError) {
      return 'Пароли не совпадают.';
    }
    return '';
  }

  submitForm(): void {
    if (this.changePasswordForm.valid) {
      const oldPassword = this.changePasswordForm.get('oldPassword')?.value;
      const newPassword = this.changePasswordForm.get('password')?.value;

      this.authService.changePassword(this.user.username, oldPassword, newPassword).subscribe({
        next: () => {
          this.changePasswordForm.disable();
          this.successMessage = 'Password successfully changed.';
          this.errorMessage = null;
          setTimeout(() => this.modalRef.close(), 2000); // Закрытие модального окна после задержки
        },
        error: (error) => {
          this.changePasswordForm.reset();
          this.errorMessage = error.message;
          this.successMessage = null;
        }
      });
    } else {
      Object.values(this.changePasswordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }



  destroy(): void {
    this.modalRef.destroy();
  }
}
