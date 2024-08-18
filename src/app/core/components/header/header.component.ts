import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { LogoutComponent } from '../../../auth/components/logout/logout.component';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, NavigationComponent, RouterLink, LogoutComponent],

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public localStorageService = inject(LocalStorageService);
}
