import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, input, Output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { Carriage } from '@/app/api/models/carriage';

import { ModalService } from '../../../shared/services/modal/modal.service';
import { SeatService } from '../../services/seat/seat.service';
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
  public firstSeat = input<number>(0);
  public freeSeats = input<number | null>(null);
  public occupiedSeats = input<number[]>([]);

  public seatsSchema = computed(() => createSeatsSchema(this.carriage()));

  public modalService = inject(ModalService);
  public seatService = inject(SeatService);

  @Output() public openEditModal: EventEmitter<Carriage> = new EventEmitter<Carriage>();

  public isOccupiedSeat(seatNumber: number): boolean {
    return this.occupiedSeats().includes(seatNumber);
  }
}
