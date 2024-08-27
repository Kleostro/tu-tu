import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { Observable } from 'rxjs';

import ENDPOINTS from '../constants/constants';
import { Carriage, Code } from '../models/carriage';

@Injectable({
  providedIn: 'root',
})
export class CarriageService {
  private httpClient = inject(HttpClient);
  public allCarriages = signal<Carriage[]>([]);
  public allCarriageTypes = computed(() => this.allCarriages().map((carriage) => carriage.code));
  public allCariageSeats = computed(() =>
    this.allCarriages().map((carriage) => ({
      code: carriage.code,
      allSeats: (carriage.leftSeats + carriage.rightSeats) * carriage.rows,
    })),
  );

  constructor() {
    this.getCarriages().subscribe((carriages) => {
      this.setAllCarriages(carriages);
    });
  }

  public getCarriages(): Observable<Carriage[]> {
    return this.httpClient.get<Carriage[]>(ENDPOINTS.CARRIAGE);
  }

  public createCarriage(carriage: Omit<Carriage, 'code'>): Observable<Code> {
    return this.httpClient.post<Code>(ENDPOINTS.CARRIAGE, carriage);
  }

  public hasCarriageNameInCarriages(name: string): boolean {
    return this.allCarriages().some((carriage) => carriage.name.toLowerCase() === name.toLowerCase());
  }

  public updateCarriage(carriage: Carriage): Observable<Code> {
    return this.httpClient.put<Code>(`${ENDPOINTS.CARRIAGE}/${carriage.code}`, carriage);
  }

  public setAllCarriages(carriages: Carriage[]): void {
    this.allCarriages.set(carriages);
  }

  public getLastNewCarriage(name: string): Carriage | null {
    return this.allCarriages().find((carriage) => carriage.name === name) ?? null;
  }

  public getCarriagesWithoutLastNewCarriage(name: string): Carriage[] {
    return this.allCarriages().filter((carriage) => carriage.name !== name);
  }

  public findCarriageByCode(code: string): Carriage | null {
    return this.allCarriages().find((carriage) => carriage.code === code) ?? null;
  }

  public collectedCarriageCodes(carriages: Carriage[]): string[] {
    return carriages.map((carriage) => carriage.code);
  }
}
