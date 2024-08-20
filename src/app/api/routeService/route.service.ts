import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import ENDPOINTS from '../constants/constants';
import { RouteBody, RouteId, RouteResponse } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private httpClient = inject(HttpClient);

  public getAllRoutes(): Observable<RouteResponse[]> {
    return this.httpClient.get<RouteResponse[]>(ENDPOINTS.ROUTE);
  }

  public createRoute(newRoute: RouteBody): Observable<RouteId> {
    return this.httpClient.post<RouteId>(ENDPOINTS.ROUTE, newRoute);
  }

  public updateRoute(id: number, route: RouteBody): Observable<RouteId> {
    return this.httpClient.put<RouteId>(`${ENDPOINTS.ROUTE}/${id}`, route);
  }

  public deleteRoute(id: number): Observable<object> {
    return this.httpClient.delete<object>(`${ENDPOINTS.ROUTE}/${id}`);
  }
}
