import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';

import ENDPOINTS from '../constants/constants';
import { RouteId } from '../models/route';
import { RideBody, RouteInfo } from '../models/schedule';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private httpClient = inject(HttpClient);

  public currentRouteId = signal<number>(NaN);
  public currentRouteInfo = signal<RouteInfo | null>(null);

  public getRouteById(id: number): Observable<RouteInfo> {
    return this.httpClient.get<RouteInfo>(`${ENDPOINTS.ROUTE}/${id}`).pipe(
      tap((routeInfo) => {
        this.currentRouteId.set(id);
        this.currentRouteInfo.set(routeInfo);
      }),
    );
  }

  public createRide(routeId: number, rideData: RideBody): Observable<RouteId> {
    return this.httpClient.post<RouteId>(`${ENDPOINTS.ROUTE}/${routeId}/${ENDPOINTS.RIDE}`, rideData);
  }

  public updateRide(routeId: number, rideId: number, rideData: RideBody): Observable<object> {
    return this.httpClient.put<object>(`${ENDPOINTS.ROUTE}/${routeId}/${ENDPOINTS.RIDE}/${rideId}`, rideData);
  }

  public deleteRide(routeId: number, rideId: number): Observable<object> {
    return this.httpClient.delete<object>(`${ENDPOINTS.ROUTE}/${routeId}/${ENDPOINTS.RIDE}/${rideId}`);
  }
}
