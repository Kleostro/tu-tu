import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  public selectedSeat$$ = signal<number | null>(null);
}
