import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { ResultListService } from '@/app/home/services/result-list/result-list.service';
import { CurrentRide } from '@/app/shared/models/currentRide.model';
import { RideService } from '@/app/shared/services/data/ride/ride.service';

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
  @Input() public carriageType!: string;
  @Input() public currentRide!: CurrentRide;

  public resultListService = inject(ResultListService);
  public rideService = inject(RideService);
  public trainCarriagesListService = inject(TrainCarriagesListService);
}
