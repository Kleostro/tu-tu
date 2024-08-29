import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CarriageComponent } from '../../../admin/components/carriage/carriage.component';
import { TrainCarriagesListService } from '../../services/train-carriages-list/train-carriages-list.service';

@Component({
  selector: 'app-train-carriages-list',
  standalone: true,
  imports: [CarriageComponent],
  templateUrl: './train-carriages-list.component.html',
  styleUrl: './train-carriages-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainCarriagesListComponent {
  public trainCarriagesListService = inject(TrainCarriagesListService);
}
