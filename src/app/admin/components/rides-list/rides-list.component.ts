import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CustomSchedule } from '@/app/api/models/schedule';

import { RideComponent } from '../ride/ride.component';

@Component({
  selector: 'app-rides-list',
  standalone: true,
  imports: [RideComponent],
  templateUrl: './rides-list.component.html',
  styleUrl: './rides-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RidesListComponent {
  public schedule = input<CustomSchedule[]>([]);
  public path = input<number[]>([]);
}
