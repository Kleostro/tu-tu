import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { CurrentRide } from '@/app/home/models/currentRide.model';
import { APP_ROUTE } from '@/app/shared/constants/routes';
import { template } from '@/app/shared/constants/string-templates';
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
    const { rideId, tripStartStationId, tripEndStationId } = this.resultItem;

    this.router.navigate([stringTemplate(template.DETAILED_PAGE_PATH, { route: APP_ROUTE.TRIP, id: rideId })], {
      queryParams: { from: tripStartStationId, to: tripEndStationId },
    });
  }
}
