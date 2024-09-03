import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { User } from '@/app/api/models/order';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { ProfileService } from '@/app/api/profileService/profile.service';
import { UserOrder } from '@/app/orders/models/userOrder.model';
import POSITION_DIRECTION from '@/app/shared/directives/position/constants/position.constants';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { TripTimelineComponent } from '../../../home/components/trip-timeline/trip-timeline.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [TripTimelineComponent, CurrencyPipe, ButtonModule, RippleModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent implements OnDestroy {
  private subscription = new Subscription();

  private cdr = inject(ChangeDetectorRef);
  private userMessageService = inject(UserMessageService);

  public modalService = inject(ModalService);
  public ordersService = inject(OrdersService);
  public profileService = inject(ProfileService);

  public isCanceled = signal(true);

  @Input() public order!: UserOrder;
  @Input() public user: User | null = null;

  public cancelOrder(): void {
    this.isCanceled.set(false);
    this.subscription.add(
      this.ordersService.cancelOrder(this.order.orderId).subscribe({
        next: () => {
          this.userMessageService.showSuccessMessage(USER_MESSAGE.ORDER_CANCELED_SUCCESSFULLY);
          this.order.status = 'canceled';
          this.cdr.detectChanges();
          this.isCanceled.set(true);
          this.modalService.closeModal();
        },
        error: () => {
          this.userMessageService.showErrorMessage(USER_MESSAGE.ORDER_CANCELED_ERROR);
          this.isCanceled.set(true);
        },
      }),
    );
  }

  public setParamsInModal(): void {
    this.modalService.position$$.set(POSITION_DIRECTION.CENTER);
    this.modalService.contentWidth$$.set('50%');
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
