import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';

import { LogoutService } from '@/app/api/logoutService/logout.service';

import { NavigationComponent } from '../../../core/components/navigation/navigation.component';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [ButtonModule, NavigationComponent, RouterLink],

  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  private localStorageService = inject(LocalStorageService);
  private logoutService = inject(LogoutService);
  private router = inject(Router);

  public authService = inject(AuthService);

  public logout(): void {
    firstValueFrom(this.logoutService.logout())
      .then(() => {
        this.authService.setLogoutSignals();
        this.localStorageService.clear();
        this.router.navigate(['/sign-in']);
      })
      .catch(() => {
        // TBD: handle error
      });
  }
}
