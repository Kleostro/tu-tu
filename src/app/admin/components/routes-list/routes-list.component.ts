import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { RouteResponse } from '@/app/api/models/route';
import { Station } from '@/app/api/models/stations';
import { RouteService } from '@/app/api/routeService/route.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

import { RouteComponent } from '../route/route.component';

@Component({
  selector: 'app-routes-list',
  standalone: true,
  imports: [RouteComponent, ButtonModule, RippleModule],
  templateUrl: './routes-list.component.html',
  styleUrl: './routes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesListComponent implements OnDestroy {
  public routeService = inject(RouteService);
  public modalService = inject(ModalService);
  public routes = input<RouteResponse[]>([]);
  public stations = input<Station[]>([]);
  public deletionRouteId = signal<number>(NaN);
  public isRouteDeleted = signal(false);
  private subscription = new Subscription();

  @ViewChild('deleteRouteConfirm') public deleteRouteConfirm!: TemplateRef<unknown>;

  public handleOpenDeleteConfirm(id: number): void {
    this.deletionRouteId.set(id);
    this.modalService.contentWidth$$.set('40%');
    this.modalService.openModal(this.deleteRouteConfirm, `Delete route ${id}?`);
  }

  public deleteRoute(): void {
    this.isRouteDeleted.set(true);
    this.subscription.add(
      this.routeService.deleteRoute(this.deletionRouteId()).subscribe(() =>
        this.routeService.getAllRoutes().subscribe(() => {
          this.isRouteDeleted.set(false);
          this.deletionRouteId.set(NaN);
          this.modalService.closeModal();
        }),
      ),
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
