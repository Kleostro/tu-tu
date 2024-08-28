import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { Order } from '@/app/api/models/order';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [TripTimelineComponent, CurrencyPipe, ButtonModule],
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
  public currentPrice = 0;

  public ngOnInit(): void {
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

  public cancelOrder(): void {
    this.order.status = 'active';
    this.cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
