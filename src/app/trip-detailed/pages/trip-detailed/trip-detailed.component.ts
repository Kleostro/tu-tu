import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { RoutingService } from '@/app/core/services/routing/routing.service';
import { CurrentRide } from '@/app/home/models/currentRide.model';
import { ResultListService } from '@/app/home/services/result-list/result-list.service';

import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';

@Component({
  selector: 'app-trip-detailed',
  standalone: true,
  imports: [TripTimelineComponent, ButtonModule, RippleModule],
  templateUrl: './trip-detailed.component.html',
  styleUrl: './trip-detailed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripDetailedComponent implements OnInit {
  private resultListService = inject(ResultListService);
  private routingService = inject(RoutingService);
  public tripItem!: CurrentRide | undefined;

  public ngOnInit(): void {
    const rides = this.resultListService.currentResultList$$();
    this.tripItem = rides.find((ride) => ride.rideId === +this.routingService.currentRideId$$());
  }

  public goBack(): void {
    this.routingService.goBack();
  }
}
