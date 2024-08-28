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

  private subscription: Subscription | null = null;

  public startSearch(searchPrms: SearchParams): void {
    const targetDate = new Date(searchPrms.time!).toISOString();
    const modifiedSearchPrms = {
      ...searchPrms,
      time: targetDate,
    };
    this.subscription = this.searchService.search(modifiedSearchPrms).subscribe({
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
      },
      error: (err: OverriddenHttpErrorResponse) => {
        this.userMessageServise.showErrorMessage(err.error.message);
      },
    });
  }

  public setCurrentRides(targetDate: string): void {
    this.resultListService.createCurrentRides(
      this.availableRoutesGroup$$()[targetDate.split('T')[0]],
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
        if (targetSegment.time[0] >= targetDate) {
          const departureDate = targetSegment.time[0].split('T')[0];
          filteredSchedule.push({
            rideId,
            segments,
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
        }
      }
    }

    Object.keys(groupedRoutes).forEach((keyDate) => {
      groupedRoutes[keyDate] = groupedRoutes[keyDate].filter((route) =>
        route.schedule.some((ride) => ride.segments.some((segment) => segment.time[0].split('T')[0] === keyDate)),
      );
    });
    return this.generateMissingKeyDates(groupedRoutes, targetDate);
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

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
