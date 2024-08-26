import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { City } from '../../models/groupedRoutes';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private httpClient = inject(HttpClient);

  public getCities(): Observable<City[]> {
    const url = 'https://raw.githubusercontent.com/ki8vi/cities-json/main/cities.json';
    const headers = new HttpHeaders().set('stop-interceptor', 'true');
    return this.httpClient.get<City[]>(url, { headers });
  }
}
