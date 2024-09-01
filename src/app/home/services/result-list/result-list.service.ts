import { inject, Injectable, signal } from '@angular/core';

import { RouteInfo } from '@/app/api/models/schedule';
import { CurrentRide } from '@/app/shared/models/currentRide.model';
import { RideService } from '@/app/shared/services/data/ride/ride.service';

import { GroupedRoute, TripPoints } from '../../models/groupedRoutes.model';

@Injectable({
  providedIn: 'root',
})
export class ResultListService {
  private rideService = inject(RideService);

  public currentResultList$$ = signal<CurrentRide[]>([]);
  public routesInfo$$ = signal<Record<string, RouteInfo> | null>(null);

  public createCurrentRides(data: GroupedRoute[], tripPoints: TripPoints): void {
    if (data === undefined) {
      this.currentResultList$$.set([]);
      return;
    }

    let currentRides: CurrentRide[] = [];

    data.forEach((routeInfo) => {
      const rides = routeInfo.schedule.map((schedule) =>
        this.rideService.createCurrentRide(routeInfo, schedule, tripPoints),
      );
      currentRides = [...currentRides, ...rides];
    });

    this.updateResultList(currentRides);
  }

  private updateResultList(currentRides: CurrentRide[]): void {
    const updatedResultList = [...currentRides];
    updatedResultList.sort((a, b) => new Date(a.tripDepartureDate).getTime() - new Date(b.tripDepartureDate).getTime());
    this.currentResultList$$.set(updatedResultList);
  }
}
