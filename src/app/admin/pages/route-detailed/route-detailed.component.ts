import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-route-detailed',
  standalone: true,
  imports: [ButtonModule, RippleModule, RouterLink],
  templateUrl: './route-detailed.component.html',
  styleUrl: './route-detailed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteDetailedComponent {
  @Input() public id = '';
}
