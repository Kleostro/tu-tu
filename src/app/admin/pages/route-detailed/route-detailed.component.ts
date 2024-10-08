import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { RideService } from '@/app/api/rideService/ride.service';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { APP_PATH } from '@/app/shared/constants/routes';

import { CreateRideFormComponent } from '../../components/create-ride-form/create-ride-form.component';
import { RidesListComponent } from '../../components/rides-list/rides-list.component';

@Component({
  selector: 'app-route-detailed',
  standalone: true,
  imports: [ButtonModule, RippleModule, RouterLink, RidesListComponent, CreateRideFormComponent, ProgressSpinnerModule],
  templateUrl: './route-detailed.component.html',
  styleUrl: './route-detailed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteDetailedComponent implements OnInit, OnDestroy {
  private subscribtion = new Subscription();

  private router = inject(Router);

  public routeService = inject(RideService);
  public stationsService = inject(StationsService);

  public id = input<string>('');

  public isOpenCreateRideForm = signal(false);
  public isDataLoaded = signal(false);

  public ngOnInit(): void {
    this.routeService.currentRouteInfo.set(null);
    this.subscribtion.add(
      this.stationsService.getStations().subscribe(() => {
        this.routeService.getRouteById(+this.id()).subscribe({
          next: () => {
            this.isDataLoaded.set(true);
          },
          error: () => {
            this.router.navigate([APP_PATH.NOT_FOUND]);
          },
        });
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }
}
