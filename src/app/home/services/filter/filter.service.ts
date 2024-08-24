import { inject, Injectable, signal } from '@angular/core';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { Route } from '@/app/api/models/search';
import { SearchService } from '@/app/api/searchService/search.service';

import { GroupedRoutes, TripPoints } from '../../model/groupedRoutes';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public availableRoutesGroup$$ = signal<GroupedRoutes>({});
  public tripPoints$$ = signal<TripPoints | null>(null);
  private searchService = inject(SearchService);

  constructor() {
    this.startFakeSearch();
  }

  private generateAvaillableRoutesGroup(routes: Route[], targetDate: Date): GroupedRoutes {
    const targetDateISO = targetDate.toISOString();
    const groupedRoutes: GroupedRoutes = {};

    routes.forEach(({ id: routeId, schedule, path, carriages }) => {
      schedule.forEach(({ rideId, segments }) => {
        segments
          .filter(({ time }) => new Date(time[0]).toISOString() > targetDateISO)
          .forEach((segment) => {
            const departureDateTime = new Date(segment.time[0]);
            const departureDate = departureDateTime.toISOString().split('T')[0];

            if (!groupedRoutes[departureDate]) {
              groupedRoutes[departureDate] = [];
            }

            groupedRoutes[departureDate].push({
              routeId,
              segment,
              rideId,
              path,
              carriages,
            });
          });
      });
    });

    return groupedRoutes;
  }

  private startFakeSearch(): void {
    const date = Date.now();
    const searchPrms = {
      fromLatitude: 33.6253023965961,
      fromLongitude: -62.87929972362075,
      toLatitude: -64.91480386879022,
      toLongitude: -169.82655423507208,
      time: date.toString(),
    };
    this.searchService.search(searchPrms).subscribe({
      next: (res) => {
        this.availableRoutesGroup$$.set(this.generateAvaillableRoutesGroup(res.routes, new Date(date)));
        this.tripPoints$$.set({
          from: res.from.city,
          to: res.to.city,
        });
      },
      error: (err: OverriddenHttpErrorResponse) => {
        throw Error(err.message);
      },
    });
  }
}
