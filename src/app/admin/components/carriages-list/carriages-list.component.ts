import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Carriage } from '@/app/api/models/carriage';

import { CarriageComponent } from '../carriage/carriage.component';

@Component({
  selector: 'app-carriages-list',
  standalone: true,
  imports: [CarriageComponent],
  templateUrl: './carriages-list.component.html',
  styleUrl: './carriages-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesListComponent {
  public allCarriages = input<Carriage[]>([]);
}
