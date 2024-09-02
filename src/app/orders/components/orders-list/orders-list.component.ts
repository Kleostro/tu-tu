import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { User } from '@/app/api/models/order';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { UserOrder } from '@/app/shared/models/userOrder.model';
import { UserOrderService } from '@/app/shared/services/data/userOrder/user-order.service';

import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [OrderComponent, NgTemplateOutlet, PaginatorModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent implements OnInit {
  public userOrderService = inject(UserOrderService);
  public ordersService = inject(OrdersService);
  public orders = signal<UserOrder[]>([]);
  public firstPage = 0;
  public rowsCount = 10;

  @Input() public users!: User[];

  public ngOnInit(): void {
    this.orders.set(
      this.userOrderService
        .currentOrders$$()
        .sort((a, b) => new Date(a.tripDepartureDate).getTime() - new Date(b.tripDepartureDate).getTime()),
    );
  }

  public onPageChange(event: PaginatorState): void {
    this.firstPage = event.first ?? 0;
    this.rowsCount = event.rows ?? 10;
  }
}
