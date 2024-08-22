import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';

import { CurrentRide } from '@/app/home/service/result-list-service/result-list.service';
import { APP_ROUTE } from '@/app/shared/constants/routes';
import { template } from '@/app/shared/constants/string-templates';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { calculateDuration } from '@/app/shared/utils/calculateDuration';
import { stringTemplate } from '@/app/shared/utils/string-template';

import { TripDetailsComponent } from '../../../trip-details/trip-details.component';
import { Event } from './models/timeline-data';

@Component({
  selector: 'app-result-item',
  standalone: true,
  imports: [TimelineModule, DatePipe, ButtonModule, TripDetailsComponent],
  templateUrl: './result-item.component.html',
  styleUrl: './result-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultItemComponent implements OnChanges {
  private router = inject(Router);
  private modalService = inject(ModalService);

  @Input() public resultItem!: CurrentRide;

  @ViewChild('modalContent') public modalContent!: TemplateRef<unknown>;

  public events: Event[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['resultItem']) {
      this.updateEvents();
    }
  }

  private updateEvents(): void {
    const { departureDate, arrivalDate, from, to } = this.resultItem;

    this.events = [
      { date: new Date(departureDate), city: from },
      { duration: '' },
      { date: new Date(arrivalDate), city: to },
    ];

    this.events[1].duration = calculateDuration(this.events[0].date, this.events[2].date);
  }

  public openModal(event: MouseEvent): void {
    event.stopPropagation();

    this.modalService.openModal(
      this.modalContent,
      stringTemplate(template.ROUTE_TITLE, { id: this.resultItem.rideId }),
    );
  }

  public redirectToDetailed(): void {
    const { rideId, fromId, toId } = this.resultItem;

    this.router.navigate([stringTemplate(template.DETAILED_PAGE_PATH, { route: APP_ROUTE.TRIP, id: rideId })], {
      queryParams: { from: fromId, to: toId },
    });
  }
}
