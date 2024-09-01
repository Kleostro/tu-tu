import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { CustomSchedule } from '@/app/api/models/schedule';

import { RideComponent } from '../ride/ride.component';

@Component({
  selector: 'app-rides-list',
  standalone: true,
  imports: [RideComponent, NgTemplateOutlet, PaginatorModule],
  templateUrl: './rides-list.component.html',
  styleUrl: './rides-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RidesListComponent {
  public schedule = input<CustomSchedule[]>([]);
  public path = input<number[]>([]);
  public firstPage = 0;
  public rowsCount = 10;

  public onPageChange(event: PaginatorState): void {
    this.firstPage = event.first ?? 0;
    this.rowsCount = event.rows ?? 10;
  }
}
