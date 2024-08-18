import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { Station } from '@/app/api/models/stations';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { MapService } from '../../services/map/map.service';

@Component({
  selector: 'app-station',
  standalone: true,
  imports: [ButtonModule, RippleModule],
  templateUrl: './station.component.html',
  styleUrl: './station.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationComponent implements OnDestroy {
  public stationsService = inject(StationsService);
  public mapService = inject(MapService);
  public isStationDeleted = signal(false);

  @Input() public station!: Station;

  private subsciption = new Subscription();

  public deleteStation(id: number): void {
    this.isStationDeleted.set(true);
    this.subsciption.add(
      this.stationsService.deleteStation(id).subscribe(() => {
        this.stationsService.getStations().subscribe((stations) => {
          this.stationsService.allStations.next(stations);
          this.mapService.removeMarker({ lng: this.station.longitude, lat: this.station.latitude });
          this.isStationDeleted.set(false);
        });
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
