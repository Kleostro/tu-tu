import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { RouteResponse } from '@/app/api/models/route';
import { StationsService } from '@/app/api/stationsService/stations.service';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteComponent {
  public stationsService = inject(StationsService);
  public route = input<RouteResponse | null>(null);
}
