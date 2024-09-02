import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { SeatService } from '../../services/seat/seat.service';

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent {
  public seatService = inject(SeatService);
  public carriageName = input<string>('');
  public carriageNumber = input<number>(NaN);
  public seatNumber = input<number>(NaN);
  public classes = input<string[]>([]);
}
