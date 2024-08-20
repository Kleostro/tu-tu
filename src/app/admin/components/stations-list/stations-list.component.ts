import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Station } from '@/app/api/models/stations';

import { StationComponent } from '../station/station.component';

@Component({
  selector: 'app-stations-list',
  standalone: true,
  imports: [StationComponent],
  templateUrl: './stations-list.component.html',
  styleUrl: './stations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsListComponent {
  @Input() public allStations!: Station[];
}
