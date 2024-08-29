import { ChangeDetectionStrategy, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import STORE_KEYS from '@/app/core/constants/store';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';
import { RoutingService } from '@/app/core/services/routing/routing.service';
import { CurrentRide } from '@/app/home/models/currentRide.model';
import { ResultListService } from '@/app/home/services/result-list/result-list.service';
import { template } from '@/app/shared/constants/string-templates';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { stringTemplate } from '@/app/shared/utils/string-template';

import { TripDetailsComponent } from '../../../home/components/trip-details/trip-details.component';
import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';
import { isCurrentRide } from './helpers/helper';

@Component({
  selector: 'app-trip-detailed',
  standalone: true,
  imports: [TripTimelineComponent, ButtonModule, RippleModule, TripDetailsComponent],
  templateUrl: './trip-detailed.component.html',
  styleUrl: './trip-detailed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripDetailedComponent implements OnInit {
  private resultListService = inject(ResultListService);
  private routingService = inject(RoutingService);
  private modalService = inject(ModalService);
  private localStorageService = inject(LocalStorageService);

  public tripItem!: CurrentRide | null;

  @ViewChild('modalContent') public modalContent!: TemplateRef<unknown>;

  public openModal(): void {
    if (this.tripItem) {
      this.modalService.openModal(
        this.modalContent,
        stringTemplate(template.ROUTE_TITLE, { id: this.tripItem.routeId }),
      );
    }
  }

  public ngOnInit(): void {
    this.tripItem = this.findRideById() ?? this.getCurrentRideFromLocalStorage();
  }

  private getCurrentRideFromLocalStorage(): CurrentRide | null {
    const currentRide = this.localStorageService.getValueByKey(STORE_KEYS.CURRENT_RIDE);
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
}
