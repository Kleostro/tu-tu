import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

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
export class TrainCarriagesListComponent implements OnInit {
  public resultListService = inject(ResultListService);
  public trainCarriagesListService = inject(TrainCarriagesListService);

  public ngOnInit(): void {
    // eslint-disable-next-line no-console
    console.log(
      this.resultListService.currentResultList$$(),
      this.resultListService.currentResultList$$()[0].trainCarriages[1].firstSeat,
      this.trainCarriagesListService.currentTrainCarriages$$(),
    );
  }
}
