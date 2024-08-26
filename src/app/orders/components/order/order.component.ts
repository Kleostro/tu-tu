import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { Order } from '@/app/api/models/order';
import { StationsService } from '@/app/api/stationsService/stations.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ButtonModule, RippleModule, DatePipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent implements OnDestroy {
  @Input() public order!: Order;
  public stationsService = inject(StationsService);
  private subsciption = new Subscription();

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
