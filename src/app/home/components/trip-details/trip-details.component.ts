import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { TimelineModule } from 'primeng/timeline';

import { CurrentRide } from '../../models/currentRide.model';
import { StationInfo } from '../../models/stationInfo.model';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [TimelineModule, DatePipe],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripDetailsComponent implements OnInit {
  @Input() public trip: CurrentRide | null = null;

  public events: StationInfo[] = [];

  public ngOnInit(): void {
    this.setData();
  }

  private setData(): void {
    if (this.trip) {
      const { stationsInfo } = this.trip;
      this.events = stationsInfo;
    }
  }
}
