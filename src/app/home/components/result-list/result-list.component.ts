import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ResultListService } from '../../services/result-list/result-list.service';
import { TripDetailsComponent } from '../trip-details/trip-details.component';
import { ResultItemComponent } from './components/result-item/result-item.component';

const imgUrl = '/img/no-results.webp';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [ResultItemComponent, TripDetailsComponent],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListComponent {
  public resultListService = inject(ResultListService);

  public imageUrl = imgUrl;
}
