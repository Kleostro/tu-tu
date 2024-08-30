import { inject, Injectable, signal } from '@angular/core';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { Carriage } from '@/app/api/models/carriage';

@Injectable({
  providedIn: 'root',
})
export class TrainCarriagesListService {
  private carriageService = inject(CarriageService);

  private allCarriages$$ = signal<Carriage[]>([]);

  public currentCarriages$$ = signal<string[]>([]);
  public currentTrainCarriages$$ = signal<Carriage[]>([]);
  public currentCarriageType$$ = signal<string>('');

  public currentCarriages: Carriage[] = [];

  constructor() {
    this.setInitialCarriages();
  }

  private setInitialCarriages(): void {
    this.carriageService.getCarriages().subscribe((carriages) => {
      this.allCarriages$$.set(carriages);
      this.updateCurrentCarriages(carriages);
      this.currentTrainCarriages$$.set(this.currentCarriages);
    });
  }

  public setCurrentCarriages(): void {
    this.currentCarriages = [];
    this.updateCurrentCarriages(this.allCarriages$$());
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
