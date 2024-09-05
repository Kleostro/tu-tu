import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { Station } from '@/app/api/models/stations';

import { StationComponent } from '../station/station.component';

@Component({
  selector: 'app-stations-list',
  standalone: true,
  imports: [StationComponent, NgTemplateOutlet, PaginatorModule],
  templateUrl: './stations-list.component.html',
  styleUrl: './stations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsListComponent {
  @Input() public allStations!: Station[];
  @Input() public firstPage = 0;
  @Input() public rowsCount = 10;

  public onPageChange(event: PaginatorState): void {
    this.firstPage = event.first!;
    this.rowsCount = event.rows!;
  }
}
