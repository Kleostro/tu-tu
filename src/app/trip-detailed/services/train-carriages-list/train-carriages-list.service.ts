import { inject, Injectable, signal } from '@angular/core';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { Carriage } from '@/app/api/models/carriage';

@Injectable({
  providedIn: 'root',
})
export class TrainCarriagesListService {
  private carriageService = inject(CarriageService);

  public currentCarriages$$ = signal<string[]>([]);
  public currentTrainCarriages$$ = signal<Carriage[]>([]);
  public currentCarriageType$$ = signal<string>('');

  public currentCarriages: Carriage[] = [];

  public setInitialCarriages(): void {
    this.currentCarriages = [];
    this.updateCurrentCarriages(this.carriageService.allCarriages());
    this.currentTrainCarriages$$.set(this.currentCarriages);
  }

  private updateCurrentCarriages(carriages: Carriage[]): void {
    this.currentCarriages$$().forEach((carriageCode) => {
      const currentCarriage = carriages.find((carriage) => carriage.code === carriageCode);
      if (currentCarriage) {
        this.currentCarriages.push(currentCarriage);
      }
    });
  }
}
