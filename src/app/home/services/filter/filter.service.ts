import { inject, Injectable, OnDestroy, signal } from '@angular/core';

import { Subscription } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { Route, SearchParams } from '@/app/api/models/search';
import { SearchService } from '@/app/api/searchService/search.service';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { GroupedRoutes, TripPoints } from '../../models/groupedRoutes';
import { ResultListService } from '../result-list/result-list.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService implements OnDestroy {
  private searchService = inject(SearchService);
  private resultListService = inject(ResultListService);
  private userMessageServise = inject(UserMessageService);
  public availableRoutesGroup$$ = signal<GroupedRoutes>({});
  public tripPoints$$ = signal<TripPoints | null>(null);

  private subscription: Subscription | null = null;

  public startSearch(searchPrms: SearchParams): void {
    const targetDate = new Date(searchPrms.time!).toISOString();
    this.subscription = this.searchService.search(searchPrms).subscribe({
      next: (res) => {
        this.availableRoutesGroup$$.set(this.generateAvailableRoutesGroup(res.routes, targetDate));
        this.tripPoints$$.set({
          from: res.from.city,
          to: res.to.city,
        });
        this.setCurrentRides(targetDate);
      },
      error: (err: OverriddenHttpErrorResponse) => {
        this.userMessageServise.showErrorMessage(err.error.message);
      },
    });
  }

  public setCurrentRides(targetDate: string): void {
    this.resultListService.createCurrentRides(
      new Date(targetDate),
      this.availableRoutesGroup$$()[targetDate.split('T')[0]],
      this.tripPoints$$()!,
    );
  }

  private generateAvailableRoutesGroup(routes: Route[], targetDate: string): GroupedRoutes {
    const groupedRoutes: GroupedRoutes = {};
    const targetTimestamp = new Date(targetDate).getTime();

    routes.forEach(({ id: routeId, schedule, path, carriages }) => {
      schedule.forEach(({ segments }) => {
        segments
          .filter(({ time }) => new Date(time[0]).getTime() > targetTimestamp)
          .forEach((segment) => {
            const departureDateTime = new Date(segment.time[0]);
            const departureDate = departureDateTime.toISOString().split('T')[0];

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

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
