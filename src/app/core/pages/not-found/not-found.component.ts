import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
