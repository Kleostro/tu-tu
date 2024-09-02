import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { OrdersService } from '@/app/api/ordersService/orders.service';
import { AuthService } from '@/app/auth/services/auth-service/auth.service';
import { UserOrderService } from '@/app/shared/services/data/userOrder/user-order.service';

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
export class OrdersComponent implements OnInit {
  public ordersService = inject(OrdersService);
  public userOrderService = inject(UserOrderService);

  public authService = inject(AuthService);

  public ngOnInit(): void {
    setTimeout(() => {
      if (this.authService.isAdmin$$()) {
        this.ordersService.getAllUsers().subscribe();
      }
      this.userOrderService.createUserOrders();
    }, 600);
  }
}
