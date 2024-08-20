import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { Station } from '@/app/api/models/stations';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

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
  private userMessageService = inject(UserMessageService);

  public stationsService = inject(StationsService);
  public mapService = inject(MapService);
  public isStationDeleted = signal(false);

  @Input() public station!: Station;

  private subsciption = new Subscription();

  public deleteStation(id: number): void {
    this.isStationDeleted.set(true);
    this.subsciption.add(
      this.stationsService.deleteStation(id).subscribe(() => {
        this.mapService.removeMarker({ lng: this.station.longitude, lat: this.station.latitude });
        this.userMessageService.showSuccessMessage(USER_MESSAGE.STATION_DELETED_SUCCESSFULLY);
        this.isStationDeleted.set(false);
        this.stationsService.getStations().subscribe();
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
