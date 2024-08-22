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
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { calculateDuration } from '@/app/shared/utils/calculateDuration';

// TBD: move to different files
function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement;
}
interface EventDetails {
  date: Date;
  city: string;
}

interface Duration {
  duration: string;
}
type Event = Partial<EventDetails> & Partial<Duration>;

@Component({
  selector: 'app-result-item',
  standalone: true,
  imports: [TimelineModule, DatePipe, ButtonModule],
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
      this.events = [
        { date: new Date(this.resultItem.departureDate), city: this.resultItem.from },
        { duration: '' },
        { date: new Date(this.resultItem.arrivalDate), city: this.resultItem.to },
      ];
      this.events[1].duration = calculateDuration(this.events[0].date, this.events[2].date);
    }
  }

  public openModal(event: MouseEvent): void {
    // TBD: remove comments
    // eslint-disable-next-line no-console
    console.log(event);
    // event.stopPropagation();
    this.modalService.openModal(this.modalContent, `Route ${this.resultItem.rideId}`);
  }

  public redirectToDetailed(event: MouseEvent): void {
    const { target } = event;

    if (isHTMLElement(target) && target.closest('.button-class')) {
      return;
    }

    this.router.navigate([`${APP_ROUTE.TRIP}/:${this.resultItem.rideId}`], {
      queryParams: { from: this.resultItem.fromId, to: this.resultItem.toId },
    });
  }
}
