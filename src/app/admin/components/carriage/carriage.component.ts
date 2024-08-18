import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { Carriage } from '@/app/api/models/carriage';

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
  public seatsSchema = computed(() => createSeatsSchema(this.carriage()!));
}
