import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import STORE_KEYS from '@/app/core/constants/store';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';
import { APP_ROUTE } from '@/app/shared/constants/routes';
import { template } from '@/app/shared/constants/string-templates';
import { CarriageInfo } from '@/app/shared/models/carriageInfo.model';
import { CurrentRide } from '@/app/shared/models/currentRide.model';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { stringTemplate } from '@/app/shared/utils/string-template';

import { TripDetailsComponent } from '../../../trip-details/trip-details.component';
import { TripTimelineComponent } from '../../../trip-timeline/trip-timeline.component';

@Component({
  selector: 'app-result-item',
  standalone: true,
  imports: [CurrencyPipe, ButtonModule, TripDetailsComponent, TripTimelineComponent],
  templateUrl: './result-item.component.html',
  styleUrl: './result-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultItemComponent {
  private router = inject(Router);
  private modalService = inject(ModalService);
  private localStorageService = inject(LocalStorageService);

  @Input() public resultItem!: CurrentRide;

  @ViewChild('modalContent') public modalContent!: TemplateRef<unknown>;

  public openModal(event: MouseEvent): void {
    event.stopPropagation();

    this.modalService.openModal(
      this.modalContent,
      stringTemplate(template.ROUTE_TITLE, { id: this.resultItem.routeId }),
    );
  }

  public redirectToDetailed(): void {
    this.saveCurrentRide();
    const { rideId, tripStartStationId, tripEndStationId } = this.resultItem;

    this.router.navigate([stringTemplate(template.DETAILED_PAGE_PATH, { route: APP_ROUTE.TRIP, id: rideId })], {
      queryParams: { from: tripStartStationId, to: tripEndStationId },
    });
  }

  private saveCurrentRide(): void {
    this.localStorageService.addValueByKey(STORE_KEYS.CURRENT_RIDE, this.resultItem);
  }

  public getSortedCarriageInfo(): CarriageInfo[] {
    if (!this.resultItem) {
      return [];
    }
    return this.resultItem.carriageInfo.slice().sort((a, b) => a.type.localeCompare(b.type));
  }
}
