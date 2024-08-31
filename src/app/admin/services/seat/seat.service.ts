import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, EMPTY, of } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { CurrentRide } from '@/app/home/models/currentRide.model';
import { APP_ROUTE } from '@/app/shared/constants/routes';
import { template } from '@/app/shared/constants/string-templates';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';
import { stringTemplate } from '@/app/shared/utils/string-template';

import { isOrderId } from './helpers/helper';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  private orderService = inject(OrdersService);
  private userMessageService = inject(UserMessageService);
  private router = inject(Router);

  public selectedSeat$$ = signal<number | null>(null);
  public seatPrice$$ = signal<number | null>(null);
  public seatCarriageNumber$$ = signal<number | null>(null);
  public seatCarriageName$$ = signal<string | null>(null);

  public setDefaultValues(): void {
    this.selectedSeat$$.set(null);
    this.seatPrice$$.set(null);
    this.seatCarriageNumber$$.set(null);
    this.seatCarriageName$$.set(null);
  }

  public bookSelectedSeat(tripItem: CurrentRide): void {
    const { rideId, tripStartStationId, tripEndStationId } = tripItem;
    const selectedSeat = this.selectedSeat$$();
    if (selectedSeat) {
      this.orderService
        .createOrder({
          rideId,
          stationStart: tripStartStationId,
          stationEnd: tripEndStationId,
          seat: selectedSeat,
        })
        .pipe(
          catchError((error: OverriddenHttpErrorResponse) => {
            this.userMessageService.showErrorMessage(error.error.message);
            return of(EMPTY);
          }),
        )
        .subscribe((response) => {
          if (isOrderId(response)) {
            this.userMessageService.showSuccessMessage(stringTemplate(template.BOOKED_ORDER, { id: response.id }));
            this.router.navigate([APP_ROUTE.ORDERS]);
          }
        });
    }
  }
}