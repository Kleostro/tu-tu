import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { AuthService } from '@/app/auth/services/auth-service/auth.service';

import { ADMIN_LINK, AUTH_LINKS, USER_LINK, USER_LINKS } from './constants/navigation-links';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, ButtonModule, DropdownModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  public authService = inject(AuthService);

  public authLinks = AUTH_LINKS;
  public userLinks = USER_LINKS;
  public userLink = USER_LINK;
  public adminLink = ADMIN_LINK;
}
