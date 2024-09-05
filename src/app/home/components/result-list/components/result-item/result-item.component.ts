import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

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
  imports: [CurrencyPipe, ButtonModule, TripDetailsComponent, TripTimelineComponent, RouterLink],
  templateUrl: './result-item.component.html',
  styleUrl: './result-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultItemComponent {
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

  public getSortedCarriageInfo(): CarriageInfo[] {
    if (!this.resultItem) {
      return [];
    }
    return this.resultItem.carriageInfo.slice().sort((a, b) => a.type.localeCompare(b.type));
  }
}
