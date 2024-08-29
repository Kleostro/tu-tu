import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, Input } from '@angular/core';

import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';

import { GroupedRoutes } from '../../models/groupedRoutes';
import { TripData } from '../../models/tripData';
import { FilterService } from '../../services/filter/filter.service';
import { ResultListComponent } from '../result-list/result-list.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [TabViewModule, CommonModule, ResultListComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  public filterService = inject(FilterService);
  @Input() public tripData!: TripData | null;

  public groupRoutes!: GroupedRoutes;
  public activeIndex = 0;

  constructor() {
    effect(() => {
      this.groupRoutes = this.filterService.availableRoutesGroup$$();
      this.takeTabsDates();
      this.activeIndex = 0;
    });
  }

  public countRidesNumbers(targetDate: string): number {
    return this.filterService.availableRoutesGroup$$()[targetDate].length;
  }

  public takeTabsDates(): string[] {
    if (!this.groupRoutes) {
      this.groupRoutes = this.filterService.availableRoutesGroup$$();
    }
    return Object.keys(this.groupRoutes).sort((a, b) => a.localeCompare(b));
  }

  public setCurrentRides(targetDate: string): void {
    this.filterService.setCurrentRides(targetDate);
  }

  public onTabChange(event: TabViewChangeEvent): void {
    const selectedDate = this.takeTabsDates()[event.index];
    this.setCurrentRides(selectedDate);
  }
}
