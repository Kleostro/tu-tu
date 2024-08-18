import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';

import { LogoutService } from '@/app/api/logoutService/logout.service';
import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';

import { NavigationComponent } from '../../../core/components/navigation/navigation.component';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [ButtonModule, NavigationComponent, RouterLink],

  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  public localStorageService = inject(LocalStorageService);
  private logoutService: LogoutService = inject(LogoutService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  public logout(): void {
    firstValueFrom(this.logoutService.logout())
      .then(() => {
        this.localStorageService.clear();
        this.router.navigate(['/sign-in']);
      })
      .catch((err: OverriddenHttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.reason });
      });
  }
}
