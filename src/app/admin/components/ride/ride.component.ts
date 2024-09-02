import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription, take } from 'rxjs';

import { CustomSchedule } from '@/app/api/models/schedule';
import { Station } from '@/app/api/models/stations';
import { RideService } from '@/app/api/rideService/ride.service';
import { StationsService } from '@/app/api/stationsService/stations.service';
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
  private subscription = new Subscription();

  public handleTimeChanged(event: RidePath, index: number): void {
    const currentRide = this.ride();
    if (currentRide) {
      this.isTimeEdited.set(false);
      if (event.from && event.to && new Date(event.from) < new Date(event.to)) {
        this.userMessageService.showErrorMessage(USER_MESSAGE.INVALID_TIME);
        this.isTimeEdited.set(true);
        return;
      }
      this.subscription.add(
        this.rideService
          .updateRide(
            this.rideService.currentRouteId(),
            this.ride()?.rideId ?? 0,
            exrtactRideDataWithUpdateTime(currentRide, event, index),
          )
          .pipe(take(1))
          .subscribe(() => {
            this.rideService.getRouteById(this.rideService.currentRouteId()).subscribe({
              next: () => {
                this.userMessageService.showSuccessMessage(USER_MESSAGE.RIDE_DATA_UPDATED_SUCCESSFULLY);
                this.isTimeEdited.set(true);
              },
            });
          }),
      );
    }
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
      this.rideService.deleteRide(this.rideService.currentRouteId(), rideId).subscribe({
        next: () =>
          this.rideService.getRouteById(this.rideService.currentRouteId()).subscribe(() => {
            this.userMessageService.showSuccessMessage(USER_MESSAGE.RIDE_DELETED_SUCCESSFULLY);
            this.isRideDeleted.set(true);
          }),
        error: () => {
          this.userMessageService.showErrorMessage(USER_MESSAGE.RIDE_DELETED_ERROR);
          this.isRideDeleted.set(true);
        },
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
