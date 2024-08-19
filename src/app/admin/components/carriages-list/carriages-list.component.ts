import { ChangeDetectionStrategy, Component, inject, input, signal, TemplateRef, ViewChild } from '@angular/core';

import { Carriage } from '@/app/api/models/carriage';
import { RoutingService } from '@/app/core/services/routing/routing.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

import { CarriageComponent } from '../carriage/carriage.component';
import { UpdateCarriageFormComponent } from '../update-carriage-form/update-carriage-form.component';

@Component({
  selector: 'app-carriages-list',
  standalone: true,
  imports: [CarriageComponent, UpdateCarriageFormComponent],
  templateUrl: './carriages-list.component.html',
  styleUrl: './carriages-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesListComponent {
  public routingService = inject(RoutingService);
  public modalService = inject(ModalService);
  public allCarriages = input<Carriage[]>([]);
  public editCarriage = signal<Carriage | null>(null);

  @ViewChild('editContent') public editContent!: TemplateRef<unknown>;

  public handleOpenEditModal(carriage: Carriage): void {
    this.editCarriage.set(carriage);
    this.modalService.openModal(this.editContent, 'Edit carriage');
  }
}
