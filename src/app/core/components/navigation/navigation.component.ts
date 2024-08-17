import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { LocalStorageService } from '../../services/local-storage/local-storage.service';
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
  public localStorageService = inject(LocalStorageService);

  public navigationLinks = NAVIGATION_LINKS;
  public userLink = USER_LINK;
  public adminLink = ADMIN_LINK;
}
