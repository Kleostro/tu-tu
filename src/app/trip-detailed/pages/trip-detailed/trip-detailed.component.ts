import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { RippleModule } from 'primeng/ripple';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';

import { SeatService } from '@/app/admin/services/seat/seat.service';
import { AuthService } from '@/app/auth/services/auth-service/auth.service';
import STORE_KEYS from '@/app/core/constants/store';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';
import { RoutingService } from '@/app/core/services/routing/routing.service';
import { ResultListService } from '@/app/home/services/result-list/result-list.service';
import { template } from '@/app/shared/constants/string-templates';
import { CarriageInfo } from '@/app/shared/models/carriageInfo.model';
import { CurrentRide } from '@/app/shared/models/currentRide.model';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { stringTemplate } from '@/app/shared/utils/string-template';

import { LoginFormComponent } from '../../../auth/components/login-form/login-form.component';
import { TripDetailsComponent } from '../../../home/components/trip-details/trip-details.component';
import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';
import { TrainCarriagesListComponent } from '../../components/train-carriages-list/train-carriages-list.component';
import { TrainCarriagesListService } from '../../services/train-carriages-list/train-carriages-list.service';
import { isCurrentRide } from './helpers/helper';

@Component({
  selector: 'app-trip-detailed',
  standalone: true,
  imports: [
    ButtonModule,
    CurrencyPipe,
    RippleModule,
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
  private resultListService = inject(ResultListService);
  private routingService = inject(RoutingService);
  private modalService = inject(ModalService);
  private localStorageService = inject(LocalStorageService);
  private trainCarriagesListService = inject(TrainCarriagesListService);
  private authService = inject(AuthService);

  public seatService = inject(SeatService);

  public tripItem!: CurrentRide | null;

  @ViewChild('tripModalContent') public tripModalContent!: TemplateRef<unknown>;
  @ViewChild('loginModalContent') public loginModalContent!: TemplateRef<unknown>;

  public ngOnInit(): void {
    this.tripItem = this.findRideById() ?? this.getCurrentRideFromLocalStorage();

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

  private getCurrentRideFromLocalStorage(): CurrentRide | null {
    const currentRide = this.localStorageService.getValueByKey(STORE_KEYS.CURRENT_RIDE);
    if (!isCurrentRide(currentRide)) {
      return null;
    }
    this.resultListService.currentResultList$$.set([currentRide]);
    return isCurrentRide(currentRide) ? currentRide : null;
  }

  private findRideById(): CurrentRide | null {
    return (
      this.resultListService
        .currentResultList$$()
        .find((ride) => ride.rideId === +this.routingService.currentRideId$$()) ?? null
    );
  }

  public goBack(): void {
    this.routingService.goBack();
  }

  public takeTabsCarriageType(): { name: string; type: string }[] {
    if (!this.tripItem) {
      return [];
    }
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
    return this.tripItem?.carriageInfo.find((carriage) => carriage.type === carriageType) ?? null;
  }

  public onTabChange(event: TabViewChangeEvent, price: number): void {
    const selectedCarriageType = this.takeTabsCarriageType()[event.index];
    this.seatService.seatPrice$$.set(price);
    this.seatService.selectedSeat$$.set(null);
    this.updateCarriagesList(selectedCarriageType.type);
    this.trainCarriagesListService.setCurrentCarriages();
  }

  private updateCarriagesList(carriageType: string): void {
    this.trainCarriagesListService.currentCarriageType$$.set(carriageType);
    this.trainCarriagesListService.currentCarriages$$.set(this.tripItem?.carriages ?? []);
  }

  public ngOnDestroy(): void {
    this.seatService.setDefaultValues();
  }

  public bookSeat(): void {
    if (this.authService.isLoggedIn$$()) {
      this.seatService.bookSelectedSeat(this.tripItem!);
    } else {
      this.modalService.openModal(this.loginModalContent);
    }
  }
}
