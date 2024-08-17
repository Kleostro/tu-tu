import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CreateStationFormComponent } from '../../components/create-station-form/create-station-form.component';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [MapComponent, CreateStationFormComponent],
  templateUrl: './stations.component.html',
  styleUrl: './stations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsComponent {}
