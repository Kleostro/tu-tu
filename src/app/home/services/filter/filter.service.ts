import { inject, Injectable, OnDestroy, signal } from '@angular/core';

import { Subscription } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { Route, SearchParams } from '@/app/api/models/search';
import { SearchService } from '@/app/api/searchService/search.service';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { GroupedRoutes, TripIds, TripPoints } from '../../models/groupedRoutes';
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
  public isSearchLoading$$ = signal(false);

  private subscription: Subscription | null = null;

  public startSearch(searchPrms: SearchParams): void {
    this.isSearchLoading$$.set(true);
    const targetDate = new Date(searchPrms.time!).toISOString();

    this.subscription = this.searchService.search(searchPrms).subscribe({
      next: (res) => {
        const tripIds = {
          from: res.from.stationId,
          to: res.to.stationId,
        };
        this.availableRoutesGroup$$.set(this.generateAvailableRoutesGroup(res.routes, tripIds, targetDate));
        this.tripPoints$$.set({
          from: res.from.city,
          to: res.to.city,
          date: targetDate,
        });
        this.setCurrentRides(targetDate);
        this.isSearchLoading$$.set(false);
      },
      error: (err: OverriddenHttpErrorResponse) => {
        this.userMessageServise.showErrorMessage(err.error.message);
        this.isSearchLoading$$.set(false);
      },
    });
  }

  public setCurrentRides(targetDate: string): void {
    this.resultListService.createCurrentRides(
      this.availableRoutesGroup$$()[this.formatDate(new Date(targetDate))],
      this.tripPoints$$()!,
    );
  }

  private generateAvailableRoutesGroup(routes: Route[], tripIds: TripIds, targetDate: string): GroupedRoutes {
    const groupedRoutes: GroupedRoutes = {};
    for (let route = 0; route < routes.length; route += 1) {
      const { schedule, path, id, carriages } = routes[route];
      const routeId = id;
      const fromStationIdIndex = path.indexOf(tripIds.from);
      for (let ride = 0; ride < schedule.length; ride += 1) {
        const filteredSchedule = [];
        const { segments, rideId } = schedule[ride];
        const targetSegment = segments[fromStationIdIndex];
        // NOTE: This code is temporarily commented out and will be removed soon
        // const nextDay = new Date(targetDate);
        // nextDay.setDate(nextDay.getDate() + 1);
        // nextDay.setHours(0, 0, 0, 0);
        // if (targetSegment.time[0] > targetDate && new Date(targetDate).getTime() < nextDay.getTime()) {
        const departureDate = this.formatDate(new Date(targetSegment.time[0]));
        filteredSchedule.push({
          rideId,
          segments: segments.map((currSegment) => {
            const departureLocalDate = new Date(currSegment.time[0]).toString();
            const arrivalLocalDate = new Date(currSegment.time[1]).toString();
            return {
              ...currSegment,
              time: [departureLocalDate, arrivalLocalDate],
            };
          }),
        });
        if (!groupedRoutes[departureDate]) {
          groupedRoutes[departureDate] = [];
        }
        groupedRoutes[departureDate].push({
          routeId,
          schedule: filteredSchedule,
          path,
          carriages,
        });
        // }
      }
    }
    return this.generateMissingKeyDates(this.filterRoutesByKeyDate(groupedRoutes), targetDate);
  }

  private generateMissingKeyDates(groupedRoutes: GroupedRoutes, targetDate: string): GroupedRoutes {
    const updatedGroupedRoutes = { ...groupedRoutes };
    const dateKeys = Object.keys(updatedGroupedRoutes).sort((a, b) => a.localeCompare(b));
    const startDate = new Date(targetDate);
    const endDate = new Date(dateKeys[dateKeys.length - 1]);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = this.formatDate(date);
      if (!updatedGroupedRoutes[dateString]) {
        updatedGroupedRoutes[dateString] = [];
      }
    }

    return updatedGroupedRoutes;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-CA');
  }

  private filterRoutesByKeyDate(groupedRoutes: GroupedRoutes): GroupedRoutes {
    const filteredRoutes = { ...groupedRoutes };
    Object.keys(groupedRoutes).forEach((keyDate) => {
      filteredRoutes[keyDate] = groupedRoutes[keyDate].filter((route) =>
        route.schedule.some((ride) =>
          ride.segments.some((segment) => this.formatDate(new Date(segment.time[0])) === keyDate),
        ),
      );
    });
    return filteredRoutes;
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
