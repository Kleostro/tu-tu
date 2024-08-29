import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, input, Output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { Carriage } from '@/app/api/models/carriage';

import { ModalService } from '../../../shared/services/modal/modal.service';
import createSeatsSchema from '../../utils/createSeatsSchema';
import { SeatComponent } from '../seat/seat.component';

@Component({
  selector: 'app-carriage',
  standalone: true,
  imports: [SeatComponent, ButtonModule, RippleModule, UpperCasePipe],
  templateUrl: './carriage.component.html',
  styleUrl: './carriage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriageComponent {
  public carriage = input<Carriage | null>(null);
  public isEditable = input(false);
  public isInteractive = input(true);
  public seatsSchema = computed(() => createSeatsSchema(this.carriage()));
  public modalService = inject(ModalService);

  @Output() public openEditModal: EventEmitter<Carriage> = new EventEmitter<Carriage>();

  // TBD: add seat start index for each carriage
}
