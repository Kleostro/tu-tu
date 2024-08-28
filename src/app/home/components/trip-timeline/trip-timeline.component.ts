import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { TimelineModule } from 'primeng/timeline';

import { calculateDuration } from '@/app/shared/utils/calculateDuration';

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
  @Input() public departureDate = '';
  @Input() public arrivalDate = '';
  @Input() public startStation = '';
  @Input() public endStation = '';

  public events: TimelineEvent[] = [];

  public ngOnInit(): void {
    this.setData();
  }

  private setData(): void {
    this.events = [
      { date: new Date(this.departureDate), city: this.startStation },
      { duration: '' },
      { date: new Date(this.arrivalDate), city: this.endStation },
    ];

    this.events[1].duration = calculateDuration(this.events[0].date, this.events[2].date);
  }
}
