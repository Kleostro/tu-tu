import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, Input } from '@angular/core';

import { TabViewModule } from 'primeng/tabview';

import { Segment } from '@/app/api/models/search';

import { GroupedRoutes } from '../../models/groupedRoutes';
import { TripData } from '../../models/tripData';
import { FilterService } from '../../services/filter/filter.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [TabViewModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  public filterService = inject(FilterService);
  @Input() public tripData!: TripData | null;

  public groupRoutes!: GroupedRoutes;

  constructor() {
    effect(() => {
      this.groupRoutes = this.filterService.availableRoutesGroup$$();
      this.takeTabsDates();
    });
  }

  public filterSegments(segment: Segment): boolean {
    return this.tripData?.tripDate ? new Date(segment.time[0]).getTime() > this.tripData?.tripDate.getTime() : false;
  }

  public takeTabsDates(): string[] {
    return Object.keys(this.groupRoutes).sort();
  }

  public filterSegmentsByTab(segments: Segment[], tabDate: string): Segment[] {
    return segments.filter(
      (segment) => segment.time[0].split('T')[0] === new Date(tabDate).toISOString().split('T')[0],
    );
  }
}
