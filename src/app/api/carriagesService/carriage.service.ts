import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Carriage, Code } from '../models/carriage';

@Injectable({
  providedIn: 'root',
})
export class CarriageService {
  private httpClient = inject(HttpClient);
  private CARRIAGE_ENDPOINT = 'carriage';
  private allCarriages = new BehaviorSubject<Carriage[]>([]);

  public getCarriages(): Observable<Carriage[]> {
    return this.httpClient.get<Carriage[]>(this.CARRIAGE_ENDPOINT);
  }

  public createCarriage(name: string, rows: number, leftSeats: number, rightSeats: number): Observable<Code> {
    const body = { name, rows, leftSeats, rightSeats };
    return this.httpClient.post<Code>(this.CARRIAGE_ENDPOINT, body);
  }

  public updateCarriage(
    code: string,
    name: string,
    rows: number,
    leftSeats: number,
    rightSeats: number,
  ): Observable<Code> {
    const body = { name, rows, leftSeats, rightSeats };
    return this.httpClient.put<Code>(`${this.CARRIAGE_ENDPOINT}/${code}`, body);
  }

  public getAllCarriages(): Observable<Carriage[]> {
    return this.allCarriages;
  }

  public setAllCarriages(carriages: Carriage[]): void {
    this.allCarriages.next(carriages);
  }
}
