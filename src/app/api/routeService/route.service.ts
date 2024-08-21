import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable, shareReplay, tap } from 'rxjs';

import ENDPOINTS from '../constants/constants';
import { RouteBody, RouteId, RouteResponse } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private httpClient = inject(HttpClient);
  public allRoutes = signal<RouteResponse[]>([]);

  public getAllRoutes(): Observable<RouteResponse[]> {
    return this.httpClient.get<RouteResponse[]>(ENDPOINTS.ROUTE).pipe(
      shareReplay(1),
      tap((routes) => this.allRoutes.set(routes)),
    );
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
