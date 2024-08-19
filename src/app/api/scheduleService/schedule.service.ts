import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { RIDE_ENDPOINT, ROUTE_ENDPOINT } from '../constants/constants';
import { RouteId } from '../models/route';
import { RideBody, RouteInfo } from '../models/schedule';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private httpClient = inject(HttpClient);

  public getRouteById(id: number): Observable<RouteInfo> {
    return this.httpClient.get<RouteInfo>(`${ROUTE_ENDPOINT}/${id}`);
  }

  public createRide(routeId: number, rideData: RideBody): Observable<RouteId> {
    return this.httpClient.post<RouteId>(`${ROUTE_ENDPOINT}/${routeId}/${RIDE_ENDPOINT}`, rideData);
  }

  public updateRide(routeId: number, rideId: number, rideData: RideBody): Observable<object> {
    return this.httpClient.put<object>(`${ROUTE_ENDPOINT}/${routeId}/${RIDE_ENDPOINT}/${rideId}`, rideData);
  }
}
