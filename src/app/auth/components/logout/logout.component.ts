import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';

import { LogoutService } from '@/app/api/logoutService/logout.service';
import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { FilterService } from '@/app/home/services/filter/filter.service';
import { APP_ROUTE } from '@/app/shared/constants/routes';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

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
  private filterService = inject(FilterService);
  private userMessageService = inject(UserMessageService);

  public authService = inject(AuthService);

  public logout(): void {
    firstValueFrom(this.logoutService.logout())
      .then(() => {
        this.authService.setLogoutSignals();
        this.localStorageService.clear();
        this.filterService.availableRoutesGroup$$.set({});
        this.filterService.tripPoints$$.set(null);
        this.router.navigate([APP_ROUTE.SIGN_IN]);
      })
      .catch((error: OverriddenHttpErrorResponse) => {
        this.userMessageService.showErrorMessage(error.error.message);
      });
  }
}
