import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { catchError, EMPTY, finalize, Observable, Subscription, take } from 'rxjs';

import { isOverriddenHttpErrorResponse } from '@/app/api/helpers/isOverriddenHttpErrorResponse';
import { CustomSchedule } from '@/app/api/models/schedule';
import { Station } from '@/app/api/models/stations';
import { RideService } from '@/app/api/rideService/ride.service';
import { StationsService } from '@/app/api/stationsService/stations.service';
import POSITION_DIRECTION from '@/app/shared/directives/position/constants/position.constants';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { RidePath, RidePrice } from '../../models/ride.model';
import {
  collectAllRideData,
  exrtactRideDataWithUpdatePrice,
  exrtactRideDataWithUpdateTime,
} from '../../utils/collectAllRideData';
import { RidePriceComponent } from '../ride-price/ride-price.component';
import { RideTimeComponent } from '../ride-time/ride-time.component';

@Component({
  selector: 'app-ride',
  standalone: true,
  imports: [ButtonModule, RippleModule, RideTimeComponent, RidePriceComponent],
  providers: [],
  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideComponent implements OnDestroy {
  private subscription = new Subscription();

  public modalService = inject(ModalService);
  private stationsService = inject(StationsService);
  private rideService = inject(RideService);
  private userMessageService = inject(UserMessageService);

  public ride = input<CustomSchedule | null>(null);
  public path = input<number[]>([]);

  public stations = computed<(Station | null)[]>(() =>
    this.path().map((id) => this.stationsService.findStationById(id)),
  );
  public fullRideData = computed(() => collectAllRideData(this.stations(), this.ride()?.segments ?? []));

  public isTimeEdited = signal(true);
  public isPriceEdited = signal(true);
  public isRideDeleted = signal(true);

  public handleTimeChanged(event: RidePath, index: number): void {
    const currentRide = this.ride();
    if (!currentRide) {
      return;
    }

    this.isTimeEdited.set(false);

    if (this.isInvalidTime(event)) {
      this.handleInvalidTime();
      return;
    }

    this.updateRideWithTime(currentRide, event, index);
  }

  private isInvalidTime(event: RidePath): boolean {
    return !!(event.from && event.to && new Date(event.from) < new Date(event.to));
  }

  private handleInvalidTime(): void {
    this.userMessageService.showErrorMessage(USER_MESSAGE.INVALID_TIME);
    this.isTimeEdited.set(true);
  }

  private updateRideWithTime(currentRide: CustomSchedule, event: RidePath, index: number): void {
    const rideData = exrtactRideDataWithUpdateTime(currentRide, event, index);

    this.subscription.add(
      this.rideService
        .updateRide(this.rideService.currentRouteId(), this.ride()?.rideId ?? 0, rideData)
        .pipe(
          take(1),
          catchError((error: unknown) => this.handleUpdateRideError(error)),
        )
        .subscribe(() => this.handleUpdateRideSuccess()),
    );
  }

  private handleUpdateRideError(error: unknown): Observable<never> {
    if (isOverriddenHttpErrorResponse(error)) {
      this.userMessageService.showErrorMessage(error.error.message);
      this.isTimeEdited.set(true);
    }
    return EMPTY;
  }

  private handleUpdateRideSuccess(): void {
    this.rideService.getRouteById(this.rideService.currentRouteId()).subscribe({
      next: () => {
        this.userMessageService.showSuccessMessage(USER_MESSAGE.RIDE_DATA_UPDATED_SUCCESSFULLY);
        this.isTimeEdited.set(true);
      },
      error: () => {
        this.userMessageService.showErrorMessage(USER_MESSAGE.INVALID_TIME);
        this.isTimeEdited.set(true);
      },
    });
  }

  public handlePriceChanged(event: RidePrice[], index: number): void {
    const currentRide = this.ride();
    if (currentRide) {
      this.isPriceEdited.set(false);
      this.subscription.add(
        this.rideService
          .updateRide(
            this.rideService.currentRouteId(),
            this.ride()?.rideId ?? 0,
            exrtactRideDataWithUpdatePrice(currentRide, event, index),
          )
          .pipe(take(1))
          .subscribe(() => {
            this.rideService.getRouteById(this.rideService.currentRouteId()).subscribe(() => {
              this.userMessageService.showSuccessMessage(USER_MESSAGE.RIDE_PRICE_UPDATED_SUCCESSFULLY);
              this.isPriceEdited.set(true);
            });
          }),
      );
    }
  }

  public deleteRide(rideId: number): void {
    this.isRideDeleted.set(false);
    this.subscription.add(
      this.rideService
        .deleteRide(this.rideService.currentRouteId(), rideId)
        .pipe(
          finalize(() => {
            this.isRideDeleted.set(true);
            this.modalService.closeModal();
          }),
        )
        .subscribe({
          next: () =>
            this.rideService.getRouteById(this.rideService.currentRouteId()).subscribe(() => {
              this.userMessageService.showSuccessMessage(USER_MESSAGE.RIDE_DELETED_SUCCESSFULLY);
            }),
          error: () => {
            this.userMessageService.showErrorMessage(USER_MESSAGE.RIDE_DELETED_ERROR);
          },
        }),
    );
  }

  public setParamsInModal(): void {
    this.modalService.contentWidth$$.set('40%');
    this.modalService.position$$.set(POSITION_DIRECTION.CENTER_TOP);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
