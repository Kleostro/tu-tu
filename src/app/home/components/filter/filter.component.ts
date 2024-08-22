import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { TabViewModule } from 'primeng/tabview';

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
export class FilterComponent {
  private searchService = inject(SearchService);
  public availableRoutes$$ = signal<Route[]>([]);

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
