import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { Order } from '@/app/api/models/order';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [TripTimelineComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent {
  @Input() public order!: Order;
  public stationsService = inject(StationsService);
}
