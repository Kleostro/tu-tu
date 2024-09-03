import { inject, Injectable, signal } from '@angular/core';

import { catchError, EMPTY, of } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { template } from '@/app/shared/constants/string-templates';
import { CurrentRide } from '@/app/shared/models/currentRide.model';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';
import { stringTemplate } from '@/app/shared/utils/string-template';

import { isOrderId } from './helpers/helper';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  private orderService = inject(OrdersService);
  private userMessageService = inject(UserMessageService);

  public selectedSeat$$ = signal<number | null>(null);
  public seatPrice$$ = signal<number | null>(null);
  public seatCarriageNumber$$ = signal<number | null>(null);
  public seatCarriageName$$ = signal<string | null>(null);
  public bookedSeatNumber$$ = signal<number | null>(null);

  public setDefaultValues(): void {
    this.selectedSeat$$.set(null);
    this.seatPrice$$.set(null);
    this.seatCarriageNumber$$.set(null);
    this.seatCarriageName$$.set(null);
    this.bookedSeatNumber$$.set(null);
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
            this.bookedSeatNumber$$.set(selectedSeat);
            this.selectedSeat$$.set(null);
          }
        });
    }
  }

  public selectSeat(seatNumber: number, carriageName: string, carriageNumber: number): void {
    if (this.selectedSeat$$() !== seatNumber) {
      this.selectedSeat$$.set(seatNumber);
      this.seatCarriageName$$.set(carriageName);
      this.seatCarriageNumber$$.set(carriageNumber);
    } else {
      this.selectedSeat$$.set(null);
      this.seatCarriageName$$.set(null);
      this.seatCarriageNumber$$.set(null);
    }
  }
}
