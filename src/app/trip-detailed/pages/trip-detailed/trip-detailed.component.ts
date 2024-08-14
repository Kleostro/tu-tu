import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-trip-detailed',
  standalone: true,
  imports: [],
  templateUrl: './trip-detailed.component.html',
  styleUrl: './trip-detailed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TripDetailedComponent {

}
