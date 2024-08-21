import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouteResponse } from '@/app/api/models/route';
import { Station } from '@/app/api/models/stations';

import { RouteComponent } from '../route/route.component';

@Component({
  selector: 'app-routes-list',
  standalone: true,
  imports: [RouteComponent],
  templateUrl: './routes-list.component.html',
  styleUrl: './routes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesListComponent {
  public routes = input<RouteResponse[]>([]);
  public stations = input<Station[]>([]);
}
