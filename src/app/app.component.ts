import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PrimeNGConfig } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';

import { StationsService } from './api/stationsService/stations.service';
import { TripDetailedService } from './api/tripDetailedService/trip-detailed.service';
import { HeaderComponent } from './core/components/header/header.component';
import { LocalStorageService } from './core/services/local-storage/local-storage.service';
import { RoutingService } from './core/services/routing/routing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MessageModule, MessagesModule],
})
export class AppComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);
  private primengConfig = inject(PrimeNGConfig);

  public routingService = inject(RoutingService);

  private tripService = inject(TripDetailedService);
  private stationsService = inject(StationsService);

  public ngOnInit(): void {
    this.localStorageService.init();
    this.primengConfig.ripple = true;

    // this.stationsService.getStations().subscribe({
    //   next: (res) => console.log(res),
    //   error: (err) => console.error(err)
    // })
    // const order = {
    //   rideId: 5,
    //   seat: 5,
    //   stationStart: 22,
    //   stationEnd: 53,
    // }
    // this.tripService.makeRideOrder(order).subscribe({
    //   next: (res) => console.log(res),
    //   error: (err) => console.error(err)
    // })
    // this.tripService.getRideInfo(1).subscribe({
    //   next: (res) => console.log(res),
    //   error: (err) => console.error(err)
    // })
    this.tripService.cancelRideOrder(5).subscribe({
      // eslint-disable-next-line no-console
      next: (res) => console.log(res),
      // eslint-disable-next-line no-console
      error: (err) => console.error(err),
    });
  }
}
