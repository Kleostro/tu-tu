import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { OrderId, OrderRequest, RideInfo } from '../models/trip-detailed';

@Injectable({
  providedIn: 'root',
})
export class TripDetailedService {
  private httpClient = inject(HttpClient);

  public getRideInfo(rideId: number): Observable<RideInfo> {
    return this.httpClient.get<RideInfo>(`search/${rideId}`);
  }

  public makeRideOrder(order: OrderRequest): Observable<OrderId> {
    return this.httpClient.post<OrderId>('order', order);
  }

  public cancelRideOrder(orderId: number): Observable<object> {
    return this.httpClient.delete<object>(`order/${orderId}`);
  }
}
