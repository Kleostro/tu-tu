import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [],
  templateUrl: './stations.component.html',
  styleUrl: './stations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsComponent {}
