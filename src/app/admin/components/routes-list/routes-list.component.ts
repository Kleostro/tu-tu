import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  Output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { RouteResponse } from '@/app/api/models/route';
import { Station } from '@/app/api/models/stations';
import { RouteService } from '@/app/api/routeService/route.service';
import POSITION_DIRECTION from '@/app/shared/directives/position/constants/position.constants';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { RouteComponent } from '../route/route.component';

@Component({
  selector: 'app-routes-list',
  standalone: true,
  imports: [RouteComponent, ButtonModule, RippleModule, PaginatorModule, NgTemplateOutlet],
  templateUrl: './routes-list.component.html',
  styleUrl: './routes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesListComponent implements OnDestroy {
  private subscription = new Subscription();

  public routeService = inject(RouteService);
  public modalService = inject(ModalService);
  public userMessageService = inject(UserMessageService);

  public routes = input<RouteResponse[]>([]);
  public stations = input<Station[]>([]);

  public deletionRouteId = signal<number>(NaN);
  public isRouteDeleted = signal(false);

  public firstPage = 0;
  public rowsCount = 10;

  @ViewChild('deleteRouteConfirm') public deleteRouteConfirm!: TemplateRef<unknown>;
  @Output() public openRouteForm: EventEmitter<void> = new EventEmitter<void>();

  public handleOpenDeleteConfirm(id: number): void {
    this.deletionRouteId.set(id);
    this.modalService.contentWidth$$.set('40%');
    this.modalService.position$$.set(POSITION_DIRECTION.CENTER_TOP);
    this.modalService.openModal(this.deleteRouteConfirm, `Delete route ${id}`);
  }

  public deleteRoute(): void {
    this.isRouteDeleted.set(true);
    this.subscription.add(
      this.routeService.deleteRoute(this.deletionRouteId()).subscribe({
        next: () => {
          this.routeService.getAllRoutes().subscribe(() => {
            this.isRouteDeleted.set(false);
            this.deletionRouteId.set(NaN);
            this.modalService.closeModal();
            this.userMessageService.showSuccessMessage(USER_MESSAGE.ROUTE_DELETED_SUCCESSFULLY);
          });
        },
        error: () => {
          this.isRouteDeleted.set(false);
          this.deletionRouteId.set(NaN);
          this.modalService.closeModal();
          this.userMessageService.showErrorMessage(USER_MESSAGE.ROUTE_DELETED_ERROR);
        },
      }),
    );
  }

  public onPageChange(event: PaginatorState): void {
    this.firstPage = event.first ?? 0;
    this.rowsCount = event.rows ?? 10;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
