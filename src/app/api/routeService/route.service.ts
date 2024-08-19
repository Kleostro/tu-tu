import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { RouteBody, RouteId, RouteResponse } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private httpClient = inject(HttpClient);
  private ROUTE_ENDPOINT = 'route';

  public getAllRoutes(): Observable<RouteResponse[]> {
    return this.httpClient.get<RouteResponse[]>(this.ROUTE_ENDPOINT);
  }

  public createRoute(newRoute: RouteBody): Observable<RouteId> {
    return this.httpClient.post<RouteId>(this.ROUTE_ENDPOINT, newRoute);
  }

  public updateRoute(id: number, route: RouteBody): Observable<RouteId> {
    return this.httpClient.put<RouteId>(`${this.ROUTE_ENDPOINT}/${id}`, route);
  }

  public deleteRoute(id: number): Observable<object> {
    return this.httpClient.delete<object>(`${this.ROUTE_ENDPOINT}/${id}`);
  }
}