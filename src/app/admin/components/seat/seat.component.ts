import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent {
  public numberSeat = input<number>(NaN);
  public classes = input<string[]>([]);
}
