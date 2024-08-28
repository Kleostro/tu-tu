import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { TimelineModule } from 'primeng/timeline';

import { calculateDuration } from '@/app/shared/utils/calculateDuration';

import { CurrentRide } from '../../models/currentRide.model';
import { TimelineEvent } from './models/timeline-data';

@Component({
  selector: 'app-trip-timeline',
  standalone: true,
  imports: [TimelineModule, DatePipe],
  templateUrl: './trip-timeline.component.html',
  styleUrl: './trip-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripTimelineComponent implements OnInit {
  @Input() public tripItem!: CurrentRide;

  public events: TimelineEvent[] = [];

  public ngOnInit(): void {
    this.setData();
  }

  private setData(): void {
    const { tripDepartureDate, tripArrivalDate, tripStartStation, tripEndStation } = this.tripItem;

    this.events = [
      { date: new Date(tripDepartureDate), city: tripStartStation },
      { duration: '' },
      { date: new Date(tripArrivalDate), city: tripEndStation },
    ];

    this.events[1].duration = calculateDuration(this.events[0].date, this.events[2].date);
  }
}
