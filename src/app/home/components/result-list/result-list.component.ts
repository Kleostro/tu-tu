import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ResultListService } from '../../service/result-list-service/result-list.service';
import { ResultItemComponent } from './components/result-item/result-item.component';

const imgUrl = '/img/no-results.webp';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [ResultItemComponent],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListComponent {
  public resultListService = inject(ResultListService);

  public imageUrl = imgUrl;
}
