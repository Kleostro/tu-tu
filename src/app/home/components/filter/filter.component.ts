import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';

import { GroupedRoutes } from '../../models/groupedRoutes.model';
import { TripData } from '../../models/tripData.model';
import { FilterService } from '../../services/filter/filter.service';
import { ResultListComponent } from '../result-list/result-list.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [TabViewModule, ResultListComponent, DatePipe],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements AfterViewInit {
  public filterService = inject(FilterService);
  @Input() public tripData!: TripData | null;

  @ViewChildren('tabView') private tabs!: QueryList<ElementRef<HTMLElement>>;
  public groupRoutes!: GroupedRoutes;

  constructor() {
    effect(() => {
      this.groupRoutes = this.filterService.availableRoutesGroup$$();
      this.takeTabsDates();
    });
  }

  public scrollToActiveTab(index: number): void {
    const innerElement = this.tabs.toArray()[index].nativeElement;
    const activeTab = innerElement.closest('.p-highlight');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'auto', inline: 'center' });
    }
  }

  public ngAfterViewInit(): void {
    if (this.takeTabsDates().length) {
      this.scrollToActiveTab(this.filterService.activeTabIndex$$());
    }
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
    this.filterService.activeTabIndex$$.set(event.index);
  }
}
