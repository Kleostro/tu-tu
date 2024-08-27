import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { RideService } from '@/app/api/rideService/ride.service';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { CreateRideFormComponent } from '../../components/create-ride-form/create-ride-form.component';
import { RidesListComponent } from '../../components/rides-list/rides-list.component';

@Component({
  selector: 'app-route-detailed',
  standalone: true,
  imports: [ButtonModule, RippleModule, RouterLink, RidesListComponent, CreateRideFormComponent],
  templateUrl: './route-detailed.component.html',
  styleUrl: './route-detailed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteDetailedComponent implements OnInit, OnDestroy {
  public routeService = inject(RideService);
  public stationsService = inject(StationsService);
  public id = input<string>('');
  public isOpenCreateRideForm = signal(false);
  private subscribtion = new Subscription();

  public ngOnInit(): void {
    this.routeService.currentRouteInfo.set(null);
    this.subscribtion.add(
      this.stationsService.getStations().subscribe(() => {
        this.routeService
          .getRouteById(+this.id())
          .subscribe
          // TBD: redirect to 404 if there is no route
          ();
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }
}
