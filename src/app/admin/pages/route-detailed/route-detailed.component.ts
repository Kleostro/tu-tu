import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-route-detailed',
  standalone: true,
  imports: [],
  templateUrl: './route-detailed.component.html',
  styleUrl: './route-detailed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteDetailedComponent {}
