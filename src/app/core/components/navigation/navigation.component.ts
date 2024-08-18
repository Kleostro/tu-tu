import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { ADMIN_LINK, NAVIGATION_LINKS, USER_LINK } from './constants/navigation-links';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, ButtonModule, DropdownModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  // TBD: uncomment when we have users logged in
  // public localStorageService = inject(LocalStorageService);

  public navigationLinks = NAVIGATION_LINKS;
  public userLink = USER_LINK;
  public adminLink = ADMIN_LINK;
}
