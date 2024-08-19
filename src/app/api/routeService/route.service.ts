import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ROUTE_ENDPOINT } from '../constants/constants';
import { RouteBody, RouteId, RouteResponse } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private httpClient = inject(HttpClient);

  public getAllRoutes(): Observable<RouteResponse[]> {
    return this.httpClient.get<RouteResponse[]>(ROUTE_ENDPOINT);
  }

  public createRoute(newRoute: RouteBody): Observable<RouteId> {
    return this.httpClient.post<RouteId>(ROUTE_ENDPOINT, newRoute);
  }

  public updateRoute(id: number, route: RouteBody): Observable<RouteId> {
    return this.httpClient.put<RouteId>(`${ROUTE_ENDPOINT}/${id}`, route);
  }

  public deleteRoute(id: number): Observable<object> {
    return this.httpClient.delete<object>(`${ROUTE_ENDPOINT}/${id}`);
  }
}
