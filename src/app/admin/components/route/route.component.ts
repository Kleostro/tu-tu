import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { RouteResponse } from '@/app/api/models/route';
import { RouteService } from '@/app/api/routeService/route.service';
import { StationsService } from '@/app/api/stationsService/stations.service';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [ButtonModule, RippleModule, RouterLink, AccordionModule],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteComponent {
  public stationsService = inject(StationsService);
  public routeService = inject(RouteService);

  public route = input<RouteResponse | null>(null);

  @Output() public openDeleteConfirm: EventEmitter<number> = new EventEmitter<number>();
  @Output() public openRouteForm: EventEmitter<void> = new EventEmitter<void>();
}
