import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { Carriage, Code } from '../models/carriage';

@Injectable({
  providedIn: 'root',
})
export class CarriageService {
  private httpClient = inject(HttpClient);
  private CARRIAGE_ENDPOINT = 'carriage';
  public allCarriages = new BehaviorSubject<Carriage[]>([]);

  public getCarriages(): Observable<Carriage[]> {
    return this.httpClient.get<Carriage[]>(this.CARRIAGE_ENDPOINT);
  }

  public createCarriage(carriage: Omit<Carriage, 'code'>): Observable<Code> {
    return this.httpClient.post<Code>(this.CARRIAGE_ENDPOINT, carriage);
  }

  public hasCarriageNameInCarriages(name: string): Observable<boolean> {
    return this.httpClient
      .get<Carriage[]>(this.CARRIAGE_ENDPOINT)
      .pipe(map((carriages) => carriages.some((carriage) => carriage.name.toLowerCase() === name.toLowerCase())));
  }

  public updateCarriage(carriage: Carriage): Observable<Code> {
    return this.httpClient.put<Code>(`${this.CARRIAGE_ENDPOINT}/${carriage.code}`, carriage);
  }

  public getAllCarriages(): Observable<Carriage[]> {
    return this.allCarriages;
  }

  public setAllCarriages(carriages: Carriage[]): void {
    this.allCarriages.next(carriages);
  }
}
