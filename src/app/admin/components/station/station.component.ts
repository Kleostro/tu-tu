import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, signal } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
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
  imports: [ButtonModule, RippleModule, AccordionModule],
  templateUrl: './station.component.html',
  styleUrl: './station.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationComponent implements OnDestroy {
  private subsciption = new Subscription();

  private userMessageService = inject(UserMessageService);

  public stationsService = inject(StationsService);
  public mapService = inject(MapService);

  public isStationDeleted = signal(false);

  @Input() public station!: Station;

  public deleteStation(id: number): void {
    this.isStationDeleted.set(true);
    this.subsciption.add(
      this.stationsService.deleteStation(id).subscribe({
        next: () => {
          this.mapService.removeMarker({ lng: this.station.longitude, lat: this.station.latitude });
          this.userMessageService.showSuccessMessage(USER_MESSAGE.STATION_DELETED_SUCCESSFULLY);
          this.isStationDeleted.set(false);
          this.stationsService.getStations().subscribe();
        },
        error: () => {
          this.userMessageService.showErrorMessage(USER_MESSAGE.STATION_DELETED_ERROR);
          this.isStationDeleted.set(false);
        },
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
