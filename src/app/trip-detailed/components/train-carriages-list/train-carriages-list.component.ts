import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ResultListService } from '@/app/home/services/result-list/result-list.service';

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
  public resultListService = inject(ResultListService);
  public trainCarriagesListService = inject(TrainCarriagesListService);
}
