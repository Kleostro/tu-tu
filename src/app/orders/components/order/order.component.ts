import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { firstValueFrom } from 'rxjs';

import { isOverriddenHttpErrorResponse } from '@/app/api/helpers/isOverriddenHttpErrorResponse';
import { User } from '@/app/api/models/order';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { ProfileService } from '@/app/api/profileService/profile.service';
import { UserOrder } from '@/app/shared/models/userOrder.model';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [TripTimelineComponent, CurrencyPipe, ButtonModule, DialogModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent {
  @Input() public order!: UserOrder;
  @Input() public user!: User;

  private userMessageService = inject(UserMessageService);

  public ordersService = inject(OrdersService);
  public profileService = inject(ProfileService);

  public displayCancelDialog = false;

  public showCancelDialog(): void {
    this.displayCancelDialog = true;
  }

  public cancelOrder(): void {
    this.order.status = 'canceled';
    this.displayCancelDialog = false;

    firstValueFrom(this.ordersService.cancelOrder(this.order.orderId))
      .then(() => {
        this.userMessageService.showSuccessMessage('Order canceled successfully.');
      })
      .catch((err: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(err);
        this.userMessageService.showErrorMessage(`Failed to cancel order. ${errorMessage}`);
      });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (isOverriddenHttpErrorResponse(error)) {
      return error.message;
    }
    return 'An unknown error occurred.';
  }
}
