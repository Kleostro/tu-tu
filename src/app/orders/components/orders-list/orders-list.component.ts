import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { User } from '@/app/api/models/order';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { UserOrderService } from '@/app/shared/services/data/userOrder/user-order.service';

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
  @Input() public users!: User[];

  public userOrderService = inject(UserOrderService);
  public ordersService = inject(OrdersService);
}
