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
  public availableRoutes$$ = signal<Route[]>([]);

  public ngOnInit(): void {
    const date = new Date('2024-08-20T22:19:57.708Z');
    const searchPrms = {
      fromLatitude: 33.6253023965961,
      fromLongitude: -62.87929972362075,
      toLatitude: -64.91480386879022,
      toLongitude: -169.82655423507208,
      time: date.toISOString(),
    };
    this.searchService.search(searchPrms).subscribe({
      next: (res) => {
        this.availableRoutes$$.set(this.findAvaillableRoutes(res.routes, new Date('2024-08-20T22:19:57.708Z')));
        // eslint-disable-next-line no-console
        console.log(res)
        // console.log(this.availableRoutes$$())
      },
      error: (err: OverriddenHttpErrorResponse) => {
        throw Error(err.message);
      },
    });
  }

  private findAvaillableRoutes(routes: Route[], targetDate: Date): Route[] {
    return routes.map((route) => {
      const filteredSchedules = route.schedule.map((schedule) => {
        const filteredSegments = schedule.segments.filter((segment) => {
          const targetDateUnix = targetDate.getTime();
          const departureDate = new Date(segment.time[0]).getTime();
          const arrivalDate = new Date(segment.time[1]).getTime();
  
          return targetDateUnix <= departureDate && targetDateUnix <= arrivalDate;
        });
  
        return { ...schedule, segments: filteredSegments };
      });
  
      return {
        ...route,
        schedule: filteredSchedules.filter((schedule) => schedule.segments.length > 0),
      };
    }).filter((route) => route.schedule.length > 0);
  }
}
