import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { TabViewModule } from 'primeng/tabview';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { Route } from '@/app/api/models/search';
import { SearchService } from '@/app/api/searchService/search.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [TabViewModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {
  private searchService = inject(SearchService);
  public dates = [
    '2024-08-12T22:19:57.708Z',
    '2024-08-14T22:19:57.708Z',
    '2024-08-15T22:19:57.708Z',
    '2024-08-20T22:19:57.708Z',
  ];
  public availableRoutes$$ = signal<Route[]>([]);

  public ngOnInit(): void {
    const date = new Date('2024-08-22T22:19:57.708Z');
    const searchPrms = {
      fromLatitude: 33.6253023965961,
      fromLongitude: -62.87929972362075,
      toLatitude: -64.91480386879022,
      toLongitude: -169.82655423507208,
      time: date.toISOString(),
    };
    this.searchService.search(searchPrms).subscribe({
      next: (res) => {
        this.availableRoutes$$.set(this.findAvaillableRoutes(res.routes, new Date('2024-08-30T22:19:57.708Z')));
      },
      error: (err: OverriddenHttpErrorResponse) => {
        throw Error(err.message);
      },
    });
  }

  private findAvaillableRoutes(routes: Route[], targetDate: Date): Route[] {
    return routes
      .map((route) => {
        const filteredSegments = route.schedule.flatMap((schedule) =>
          schedule.segments.filter((segment) => {
            const targetDateUnix = new Date(targetDate).toISOString();
            const departureDate = new Date(segment.time[0]).toISOString();
            const arrivalDate = new Date(segment.time[1]).toISOString();

            return targetDateUnix <= departureDate && targetDateUnix <= arrivalDate;
          }),
        );

        return {
          ...route,
          schedule: filteredSegments.length ? [{ ...route.schedule[0], segments: filteredSegments }] : route.schedule,
        };
      })
      .filter((route) => route.schedule.some((schedule) => schedule.segments.length > 0));
  }
}
