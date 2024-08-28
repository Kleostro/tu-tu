import { ChangeDetectionStrategy, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { RoutingService } from '@/app/core/services/routing/routing.service';
import { CurrentRide } from '@/app/home/models/currentRide.model';
import { ResultListService } from '@/app/home/services/result-list/result-list.service';
import { template } from '@/app/shared/constants/string-templates';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { stringTemplate } from '@/app/shared/utils/string-template';

import { TripDetailsComponent } from '../../../home/components/trip-details/trip-details.component';
import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';

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

  public tripItem!: CurrentRide | null;

  @ViewChild('modalContent') public modalContent!: TemplateRef<unknown>;

  public openModal(event: MouseEvent): void {
    event.stopPropagation();
    if (this.tripItem) {
      this.modalService.openModal(
        this.modalContent,
        stringTemplate(template.ROUTE_TITLE, { id: this.tripItem.routeId }),
      );
    }
  }

  public ngOnInit(): void {
    const rides = this.resultListService.currentResultList$$();
    const foundRide = rides.find((ride) => ride.rideId === +this.routingService.currentRideId$$());
    this.tripItem = foundRide ?? null;
  }

  public goBack(): void {
    this.routingService.goBack();
  }
}
