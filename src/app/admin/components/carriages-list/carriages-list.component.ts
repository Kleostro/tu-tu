import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal, TemplateRef, ViewChild } from '@angular/core';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { Carriage } from '@/app/api/models/carriage';
import { RoutingService } from '@/app/core/services/routing/routing.service';
import POSITION_DIRECTION from '@/app/shared/directives/position/constants/position.constants';
import { ModalService } from '@/app/shared/services/modal/modal.service';

import { CarriageComponent } from '../carriage/carriage.component';
import { UpdateCarriageFormComponent } from '../update-carriage-form/update-carriage-form.component';

@Component({
  selector: 'app-carriages-list',
  standalone: true,
  imports: [CarriageComponent, UpdateCarriageFormComponent, NgTemplateOutlet, PaginatorModule],
  templateUrl: './carriages-list.component.html',
  styleUrl: './carriages-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesListComponent {
  public routingService = inject(RoutingService);
  public modalService = inject(ModalService);
  public allCarriages = input<Carriage[]>([]);
  public editCarriage = signal<Carriage | null>(null);
  public firstPage = 0;
  public rowsCount = 10;

  @ViewChild('editContent') public editContent!: TemplateRef<unknown>;

  public handleOpenEditModal(carriage: Carriage): void {
    this.editCarriage.set(carriage);
    this.modalService.position$$.set(POSITION_DIRECTION.CENTER_TOP);
    this.modalService.openModal(this.editContent, 'Edit carriage');
  }

  public onPageChange(event: PaginatorState): void {
    this.firstPage = event.first!;
    this.rowsCount = event.rows!;
  }
}
