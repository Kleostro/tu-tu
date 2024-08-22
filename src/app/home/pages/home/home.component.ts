import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ResultListComponent } from '../../components/result-list/result-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ResultListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
