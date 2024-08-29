import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { firstValueFrom, Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { Order } from '@/app/api/models/order';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [TripTimelineComponent, CurrencyPipe, ButtonModule, DialogModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent implements OnInit, OnDestroy {
  @Input() public order!: Order;
  private cdr = inject(ChangeDetectorRef);
  public carriageService = inject(CarriageService);
  public stationsService = inject(StationsService);
  public ordersService = inject(OrdersService);
  private subsciption = new Subscription();
  public carriageName = '';
  public currentPrice = 0;
  private userMessageService = inject(UserMessageService);
  public displayCancelDialog = false;

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

  public showCancelDialog(): void {
    this.displayCancelDialog = true;
  }

  public cancelOrder(): void {
    this.order.status = 'canceled';
    this.displayCancelDialog = false;
    this.cdr.detectChanges();

    // Since no order on server, using mocked data
    firstValueFrom(this.ordersService.cancelOrder(this.order.id))
      .then(() => {
        this.userMessageService.showSuccessMessage('Order canceled successfully.');
      })
      .catch((err: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(err);
        this.userMessageService.showErrorMessage(`Failed to cancel order. ${errorMessage}`);
      });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const errorObj = error.error as { message: string };
      return errorObj.message;
    }
    return 'An unknown error occurred.';
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
