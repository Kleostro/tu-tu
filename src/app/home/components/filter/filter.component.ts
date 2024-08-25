import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';

import { TabViewModule } from 'primeng/tabview';

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
  public timeStampMs$$ = signal(0);

  
  public generateDateInMs(date: string | Date): number {
    return new Date(date).getTime();
  }
}
