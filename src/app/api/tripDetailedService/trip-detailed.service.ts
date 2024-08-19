import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { RideInfo } from '../models/trip-detailed';

@Injectable({
  providedIn: 'root',
})
export class TripDetailedService {
  private httpClient = inject(HttpClient);

  public getRideInfo(rideId: number): Observable<RideInfo> {
    return this.httpClient.get<RideInfo>(`search/${rideId}`);
  }
}
