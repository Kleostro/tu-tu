import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RoutingService } from '../../services/routing/routing.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public routingService = inject(RoutingService);
}
