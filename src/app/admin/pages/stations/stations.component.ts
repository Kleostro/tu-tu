import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { StationsService } from '@/app/api/stationsService/stations.service';

import { CreateStationFormComponent } from '../../components/create-station-form/create-station-form.component';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [MapComponent, CreateStationFormComponent, AsyncPipe],
  templateUrl: './stations.component.html',
  styleUrl: './stations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsComponent {
  private stationsService = inject(StationsService);
  public allStations = toSignal(this.stationsService.getStations());
}
