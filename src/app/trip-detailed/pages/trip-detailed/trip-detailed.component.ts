import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { Subscription } from 'rxjs';

import { SeatService } from '@/app/admin/services/seat/seat.service';
import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { RideInfo } from '@/app/api/models/trip-detailed';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { TripDetailedService } from '@/app/api/tripDetailedService/trip-detailed.service';
import { AuthService } from '@/app/auth/services/auth-service/auth.service';
import { RoutingService } from '@/app/core/services/routing/routing.service';
import { template } from '@/app/shared/constants/string-templates';
import { CarriageInfo } from '@/app/shared/models/carriageInfo.model';
import { CurrentRide } from '@/app/shared/models/currentRide.model';
import { RideService } from '@/app/shared/services/data/ride/ride.service';
import { TripStationsService } from '@/app/shared/services/data/tripStations/trip-stations.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { stringTemplate } from '@/app/shared/utils/string-template';

import { LoginFormComponent } from '../../../auth/components/login-form/login-form.component';
import { TripDetailsComponent } from '../../../home/components/trip-details/trip-details.component';
import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';
import { TrainCarriagesListComponent } from '../../components/train-carriages-list/train-carriages-list.component';
import { TrainCarriagesListService } from '../../services/train-carriages-list/train-carriages-list.service';

@Component({
  selector: 'app-trip-detailed',
  standalone: true,
  imports: [
    ButtonModule,
    CurrencyPipe,
    TabViewModule,
    FieldsetModule,
    DatePipe,
    TripTimelineComponent,
    TripDetailsComponent,
    TrainCarriagesListComponent,
    LoginFormComponent,
  ],
  templateUrl: './trip-detailed.component.html',
  styleUrl: './trip-detailed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripDetailedComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  private tripDetailedService = inject(TripDetailedService);
  private routingService = inject(RoutingService);
  private modalService = inject(ModalService);
  private trainCarriagesListService = inject(TrainCarriagesListService);
  private authService = inject(AuthService);
  private stationsService = inject(StationsService);
  private carriageService = inject(CarriageService);

  public tripStationsService = inject(TripStationsService);
  public rideService = inject(RideService);
  public seatService = inject(SeatService);

  public tripItem!: CurrentRide;

  @ViewChild('tripModalContent') public tripModalContent!: TemplateRef<unknown>;
  @ViewChild('loginModalContent') public loginModalContent!: TemplateRef<unknown>;

  public ngOnInit(): void {
    this.subscription.add(
      this.carriageService.getCarriages().subscribe((carriages) => {
        this.carriageService.allCarriages.set(carriages);
        this.trainCarriagesListService.currentTrainCarriages$$.set(carriages);
        this.stationsService.getStations().subscribe(() =>
          this.tripDetailedService.getRideInfo(+this.routingService.currentRideId$$()).subscribe((ride) => {
            this.initializeRide(ride);
            this.setInitialValues();
            this.trainCarriagesListService.setInitialCarriages();
          }),
        );
      }),
    );
  }

  private initializeRide(ride: RideInfo): void {
    const tripPoints = this.routingService.currentTripPoints$$();
    const currentRide = this.rideService.createCurrentRideById(ride, ride.schedule, tripPoints);
    this.rideService.rideFromId$$.set(currentRide);
    this.tripItem = currentRide;
  }

  private setInitialValues(): void {
    const firstCarriage = this.takeTabsCarriageType()[0].type;
    this.updateCarriagesList(firstCarriage);
    this.setInitialPrice(firstCarriage);
  }

  private setInitialPrice(firstCarriage: string): void {
    const firstCarriagePrice = this.getPrice(firstCarriage);
    this.seatService.seatPrice$$.set(firstCarriagePrice);
  }

  public openModal(): void {
    if (this.tripItem) {
      this.modalService.openModal(
        this.tripModalContent,
        stringTemplate(template.ROUTE_TITLE, { id: this.tripItem.routeId }),
      );
    }
  }

  public goBack(): void {
    this.routingService.goBack();
  }

  public takeTabsCarriageType(): { name: string; type: string }[] {
    return this.tripItem.carriageInfo
      .map((carriage) => ({ name: carriage.name, type: carriage.type }))
      .sort((a, b) => a.type.localeCompare(b.type));
  }

  public getPrice(carriageType: string): number {
    return this.findCarriage(carriageType)?.price ?? 0;
  }

  public getFreeSeatsNumber(carriageType: string): number {
    return this.findCarriage(carriageType)?.freeSeats ?? 0;
  }

  private findCarriage(carriageType: string): CarriageInfo | null {
    return this.tripItem.carriageInfo.find((carriage) => carriage.type === carriageType) ?? null;
  }

  public onTabChange(event: TabViewChangeEvent, price: number): void {
    const selectedCarriageType = this.takeTabsCarriageType()[event.index];
    this.seatService.seatPrice$$.set(price);
    this.seatService.selectedSeat$$.set(null);
    this.updateCarriagesList(selectedCarriageType.type);
  }

  private updateCarriagesList(carriageType: string): void {
    this.trainCarriagesListService.currentCarriageType$$.set(carriageType);
    this.trainCarriagesListService.currentCarriages$$.set(this.tripItem.carriages);
  }

  public bookSeat(): void {
    if (this.authService.isLoggedIn$$()) {
      this.seatService.bookSelectedSeat(this.tripItem);
      this.seatService.hasResponse$$.set(false);
    } else {
      this.modalService.openModal(this.loginModalContent);
    }
  }

  public ngOnDestroy(): void {
    this.seatService.setDefaultValues();
    this.subscription.unsubscribe();
  }
}
