import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { RouteService } from '@/app/api/routeService/route.service';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { RoutesListComponent } from '../../components/routes-list/routes-list.component';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [RoutesListComponent],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesComponent implements OnInit, OnDestroy {
  public routeService = inject(RouteService);
  public stationsService = inject(StationsService);

  private subscription = new Subscription();

  public ngOnInit(): void {
    this.subscription.add(this.routeService.getAllRoutes().subscribe());
    this.subscription.add(this.stationsService.getStations().subscribe());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
