import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { OrdersService } from '@/app/api/ordersService/orders.service';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { OrdersListComponent } from '../../components/orders-list/orders-list.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrdersListComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit, OnDestroy {
  public ordersService = inject(OrdersService);
  public stationsService = inject(StationsService);
  private subsciption = new Subscription();

  public ngOnInit(): void {
    this.subsciption.add(this.ordersService.getOrders().subscribe());
    this.subsciption.add(this.stationsService.getStations().subscribe());
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
