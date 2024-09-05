import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { AuthService } from '@/app/auth/services/auth-service/auth.service';

import { OrdersListComponent } from '../../components/orders-list/orders-list.component';
import { UserOrderService } from '../../services/userOrder/user-order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrdersListComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  private carriageService = inject(CarriageService);
  private stationsService = inject(StationsService);

  public ordersService = inject(OrdersService);
  public userOrderService = inject(UserOrderService);
  public authService = inject(AuthService);

  public ngOnInit(): void {
    if (this.authService.isAdmin$$()) {
      this.subscription.add(this.ordersService.getAllUsers().subscribe());
    }
    this.subscription.add(
      this.ordersService.getAllOrders().subscribe(() =>
        this.stationsService.getStations().subscribe(() =>
          this.carriageService.getCarriages().subscribe((carriages) => {
            this.carriageService.allCarriages.set(carriages);
            this.userOrderService.createUserOrders();
          }),
        ),
      ),
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
