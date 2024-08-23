import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TabViewModule } from 'primeng/tabview';

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
}
