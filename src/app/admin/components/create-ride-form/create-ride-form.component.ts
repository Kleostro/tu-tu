import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { Subscription, take } from 'rxjs';

import { RideService } from '@/app/api/rideService/ride.service';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { CarriageTypeControls, CarriageTypesFGType, TimesFGType } from '../../models/create-ride-form.model';
import { collectNewRideData } from '../../utils/collectAllRideData';

@Component({
  selector: 'app-create-ride-form',
  standalone: true,
  imports: [ReactiveFormsModule, CalendarModule, InputNumberModule],
  templateUrl: './create-ride-form.component.html',
  styleUrl: './create-ride-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateRideFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  public rideService = inject(RideService);
  public stationsService = inject(StationsService);
  public userMessageService = inject(UserMessageService);
  public stationNamesList = computed(() => {
    const routeInfo = this.rideService.currentRouteInfo();
    if (routeInfo) {
      return routeInfo.path.map((id) => this.stationsService.findStationById(id)?.city ?? null);
    }
    return [];
  });
  public carriageTypes = computed(() => this.rideService.currentRouteInfo()?.carriages);
  public createRideForm = this.fb.nonNullable.group({
    times: this.fb.array<TimesFGType>([]),
    carriageTypes: this.fb.array<CarriageTypesFGType>([]),
  });
  public Object = Object;
  public minDate = new Date();
  public time = false;
  public isRideCreated = signal(true);
  private subscription = new Subscription();

  public submit(): void {
    this.isRideCreated.set(false);
    this.createRideForm.markAllAsTouched();
    this.createRideForm.updateValueAndValidity();
    if (!this.createRideForm.valid) {
      this.isRideCreated.set(false);
      return;
    }

    const { carriageTypes, times } = this.createRideForm.getRawValue();
    this.subscription.add(
      this.rideService
        .createRide(this.rideService.currentRouteId(), collectNewRideData(carriageTypes, times))
        .pipe(take(1))
        .subscribe(() =>
          this.rideService.getRouteById(this.rideService.currentRouteId()).subscribe(() => {
            this.isRideCreated.set(true);
            this.userMessageService.showSuccessMessage(USER_MESSAGE.RIDE_CREATED_SUCCESSFULLY);
          }),
        ),
    );
  }

  public selectTime(event: Date): void {
    this.time = !!event;
  }

  public addTimeGroup(): TimesFGType {
    const timeGroup: TimesFGType = this.fb.nonNullable.group({
      departure: this.fb.nonNullable.control('', [Validators.required.bind(this)]),
      arrival: this.fb.nonNullable.control('', [Validators.required.bind(this)]),
    });

    return timeGroup;
  }

  public addCarriageTypesGroup(): CarriageTypesFGType {
    const controls = this.carriageTypes()!.map(() =>
      this.fb.nonNullable.control(1, [Validators.required.bind(this), Validators.min(1)]),
    );
    const carriageTypesGroup = this.fb.nonNullable.group(
      this.carriageTypes()!.reduce((acc: CarriageTypeControls, carriageType, i) => {
        acc[carriageType] = controls[i];
        return acc;
      }, {}),
    );

    return carriageTypesGroup;
  }

  public ngOnInit(): void {
    this.createRideForm.controls.times.clear();
    this.createRideForm.controls.carriageTypes.clear();
    this.stationNamesList().forEach((_, index) => {
      if (index < this.stationNamesList().length - 1) {
        this.createRideForm.controls.times.push(this.addTimeGroup());
        this.createRideForm.controls.carriageTypes.push(this.addCarriageTypesGroup());
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
