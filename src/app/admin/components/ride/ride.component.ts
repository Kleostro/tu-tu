import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { CustomSchedule } from '@/app/api/models/schedule';
import { Station } from '@/app/api/models/stations';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { RidePipe } from '../../pipes/ride.pipe';

@Component({
  selector: 'app-ride',
  standalone: true,
  imports: [RidePipe, CurrencyPipe, DatePipe],
  providers: [RidePipe, CurrencyPipe, DatePipe],
  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideComponent {
  private stationsService = inject(StationsService);
  public ride = input<CustomSchedule | null>(null);
  public path = input<number[]>([]);
  public stations = computed<(Station | null)[]>(() =>
    this.path().map((id) => this.stationsService.findStationById(id)),
  );
}
