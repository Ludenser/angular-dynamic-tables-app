import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../../services/auth/auth.service';
import { ChangePasswordComponent } from './change-password/change-password.component';

// Определяем интерфейс для профиля пользователя
interface Profile {
  name: string;
  code: string;
  avatarUrl: string;
}

@Component({
  selector: 'showcase-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  // Указываем, что компонент может использоваться самостоятельно без объявления в модуле
  standalone: true,
  // Импортируем необходимые модули для компонента
  imports: [NzModalModule, NzDropDownModule, NzMenuModule, NzAvatarModule]
})
export class UserProfileComponent {
  // Инициализируем профиль с пустыми значениями
  profile: Profile = {
    name: '',
    code: '',
    avatarUrl: ''
  };

  // Внедряем зависимости для сервиса аутентификации, роутера и сервиса модальных окон
  constructor(
    private authService: AuthService,
    private router: Router,
    private modal: NzModalService
  ) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changePassword(): void {
    this.modal.create({
      nzTitle: 'Смена пароля',
      nzContent: ChangePasswordComponent,
      nzCentered: true,
      nzOnOk: () => console.log('Password change confirmed'),
      nzFooter: null,
      nzMaskClosable: true
    });
  }
}
