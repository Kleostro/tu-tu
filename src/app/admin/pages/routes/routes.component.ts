import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesComponent {}
