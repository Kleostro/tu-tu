import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { TimelineModule } from 'primeng/timeline';

import { CurrentRide } from '../../service/result-list-service/result-list.service';
import { EventDetails } from './models/timeline-data';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [TimelineModule, DatePipe],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripDetailsComponent implements OnInit {
  @Input() public trip!: CurrentRide;

  public events: EventDetails[] = [];

  public ngOnInit(): void {
    this.setData();
  }

  private setData(): void {
    const { departureDate, arrivalDate, to } = this.trip;

    this.events = [
      {
        arrivalDate: new Date(arrivalDate),
        departureDate: new Date(departureDate),
        station: to,
        duration: '',
        firstStation: true,
      },
      { arrivalDate: new Date(arrivalDate), departureDate: new Date(departureDate), station: to, duration: '2min' },
      { arrivalDate: new Date(arrivalDate), departureDate: new Date(departureDate), station: to, duration: '2min' },
      { arrivalDate: new Date(arrivalDate), departureDate: new Date(departureDate), station: to, duration: '2min' },
      { arrivalDate: new Date(arrivalDate), departureDate: new Date(departureDate), station: to, duration: '2min' },
      { arrivalDate: new Date(arrivalDate), departureDate: new Date(departureDate), station: to, duration: '2min' },
      { arrivalDate: new Date(arrivalDate), departureDate: new Date(departureDate), station: to, duration: '2min' },
      { arrivalDate: new Date(arrivalDate), departureDate: new Date(departureDate), station: to, duration: '2min' },

      {
        arrivalDate: new Date(arrivalDate),
        departureDate: new Date(departureDate),
        station: to,
        duration: '',
        lastStation: true,
      },
    ];
    // TBD: check comment
    // this.events[1].duration = calculateDuration(this.events[0].date, this.events[2].date);
  }
}
