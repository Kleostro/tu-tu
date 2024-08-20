import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { Carriage, Code } from '../models/carriage';

@Injectable({
  providedIn: 'root',
})
export class CarriageService {
  private httpClient = inject(HttpClient);
  private CARRIAGE_ENDPOINT = 'carriage';
  public allCarriages = signal<Carriage[]>([]);

  public getCarriages(): Observable<Carriage[]> {
    return this.httpClient.get<Carriage[]>(this.CARRIAGE_ENDPOINT);
  }

  public createCarriage(carriage: Omit<Carriage, 'code'>): Observable<Code> {
    return this.httpClient.post<Code>(this.CARRIAGE_ENDPOINT, carriage);
  }

  public hasCarriageNameInCarriages(name: string): boolean {
    return this.allCarriages().some((carriage) => carriage.name.toLowerCase() === name.toLowerCase());
  }

  public updateCarriage(carriage: Carriage): Observable<Code> {
    return this.httpClient.put<Code>(`${this.CARRIAGE_ENDPOINT}/${carriage.code}`, carriage);
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
}
