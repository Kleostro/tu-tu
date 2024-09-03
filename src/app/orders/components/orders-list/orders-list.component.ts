import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { User } from '@/app/api/models/order';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { UserOrder } from '@/app/orders/models/userOrder.model';

import { UserOrderService } from '../../services/userOrder/user-order.service';
import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [OrderComponent, NgTemplateOutlet, PaginatorModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent implements OnInit, OnDestroy {
  public userOrderService = inject(UserOrderService);
  public ordersService = inject(OrdersService);
  public orders = signal<UserOrder[]>([]);
  public firstPage = 0;
  public rowsCount = 10;

  @Input() public users!: User[];

  public ngOnInit(): void {
    this.userOrderService.createUserOrders();
    const orders = this.userOrderService.currentOrders$$();
    if (orders?.length) {
      orders.sort((a, b) => new Date(a.tripDepartureDate).getTime() - new Date(b.tripDepartureDate).getTime());
      this.orders.set(orders);
    }
  }

  public onPageChange(event: PaginatorState): void {
    this.firstPage = event.first ?? 0;
    this.rowsCount = event.rows ?? 10;
  }

  public ngOnDestroy(): void {
    this.userOrderService.currentOrders$$.set(null);
  }
}
