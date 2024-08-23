import { Injectable, signal } from '@angular/core';

import { Route } from '@/app/api/models/search';

import { GroupedRoutes, TripPoints } from '../../model/groupedRoutes';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public availableRoutesGroup$$ = signal<GroupedRoutes>({});
  public tripPoints$$ = signal<TripPoints | null>(null);

  private generateAvaillableRoutesGroup(routes: Route[], targetDate: Date): GroupedRoutes {
    const targetDateUnix = targetDate.toISOString();
    const groupedRoutes: GroupedRoutes = {};

    routes.forEach(({ id: routeId, schedule, path, carriages }) => {
      schedule.forEach(({ rideId, segments }) => {
        segments
          .filter(({ time }) => new Date(time[0]).toISOString() > targetDateUnix)
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
}
