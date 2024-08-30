import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { Order, User } from '@/app/api/models/order';
import { OrdersService } from '@/app/api/ordersService/orders.service';

import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [OrderComponent],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent {
  @Input() public orders!: Order[];
  @Input() public users!: User[];
  public ordersService = inject(OrdersService);
}
