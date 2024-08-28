import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TimelineModule } from 'primeng/timeline';
import { Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { Order } from '@/app/api/models/order';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { calculateDuration } from '@/app/shared/utils/calculateDuration';

import { Event } from '../../models/timeline-data.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ButtonModule, RippleModule, DatePipe, TimelineModule, CurrencyPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent implements OnInit, OnDestroy {
  @Input() public order!: Order;
  private cdr = inject(ChangeDetectorRef);
  public carriageService = inject(CarriageService);
  public stationsService = inject(StationsService);
  private subsciption = new Subscription();
  public carriageName = '';
  public events: Event[] = [];
  public currentPrice = 0;

  public ngOnInit(): void {
    this.setData();
  }

  private setData(): void {
    const departureDate = this.order.schedule.segments[0].time[0];
    const arrivalDate = this.order.schedule.segments[this.order.schedule.segments.length - 1].time[1];
    const departureStationId = this.order.path[0];
    const arrivalStationId = this.order.path[this.order.path.length - 1];
    this.events = [
      { date: new Date(departureDate), stationID: departureStationId },
      { duration: calculateDuration(departureDate, arrivalDate) },
      { date: new Date(arrivalDate), stationID: arrivalStationId },
    ];
    this.subsciption.add(
      this.carriageService.getCarriages().subscribe((carriages) => {
        const matchingCarriage = carriages.find((carriage) => this.order.carriages.includes(carriage.code));
        if (matchingCarriage) {
          this.carriageName = matchingCarriage.name;
          this.currentPrice = this.order.schedule.segments.reduce((acc, val) => acc + val.price[this.carriageName], 0);
          this.cdr.detectChanges();
        }
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
