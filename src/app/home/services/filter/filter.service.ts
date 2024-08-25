import { inject, Injectable, signal } from '@angular/core';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { Route, SearchParams } from '@/app/api/models/search';
import { SearchService } from '@/app/api/searchService/search.service';

import { GroupedRoutes, TripPoints } from '../../models/groupedRoutes';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public availableRoutesGroup$$ = signal<GroupedRoutes>({});
  public tripPoints$$ = signal<TripPoints | null>(null);
  private searchService = inject(SearchService);

  public startSearch(searchPrms: SearchParams): void {
    const targetDate = new Date(searchPrms.time!).toISOString();
    this.searchService.search(searchPrms).subscribe({
      next: (res) => {
        this.availableRoutesGroup$$.set(this.generateAvaillableRoutesGroup(res.routes, targetDate));
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

  private generateAvaillableRoutesGroup(routes: Route[], targetDate: string): GroupedRoutes {
    const groupedRoutes: GroupedRoutes = {};
    const targetTimestamp = new Date(targetDate).getTime();

    routes.forEach(({ id: routeId, schedule, path, carriages }) => {
      schedule.forEach(({ segments }) => {
        segments
          .filter(({ time }) => new Date(time[0]).getTime() > targetTimestamp)
          .forEach((segment) => {
            const departureDateTime = new Date(segment.time[0]);
            const departureDate = `${departureDateTime.getFullYear()}-${(departureDateTime.getMonth() + 1)
              .toString()
              .padStart(2, '0')}-${departureDateTime.getDate().toString().padStart(2, '0')}`;

            if (!groupedRoutes[departureDate]) {
              groupedRoutes[departureDate] = [];
            }

            groupedRoutes[departureDate].push({
              routeId,
              schedule,
              path,
              carriages,
            });
          });
      });
    });

    return groupedRoutes;
  }
}
