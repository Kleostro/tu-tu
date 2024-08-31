import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  public selectedSeat$$ = signal<number | null>(null);
  public seatPrice$$ = signal<number | null>(null);
  public seatCarriageNumber$$ = signal<number | null>(null);
  public seatCarriageName$$ = signal<string | null>(null);

  public setDefaultValues(): void {
    this.selectedSeat$$.set(null);
    this.seatPrice$$.set(null);
    this.seatCarriageNumber$$.set(null);
    this.seatCarriageName$$.set(null);
  }
}
