import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ResultListComponent } from '../../components/result-list/result-list.component';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ResultListComponent, SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
