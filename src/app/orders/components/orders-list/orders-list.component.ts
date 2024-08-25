import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Order } from '@/app/api/models/order';

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
}
