import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Station } from '@/app/api/models/stations';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private httpClient = inject(HttpClient);

  public getCities(): Observable<Station[]> {
    const url = 'https://raw.githubusercontent.com/ki8vi/cities-json/main/fixed';
    const headers = new HttpHeaders().set('stop-interceptor', 'true');
    return this.httpClient.get<Station[]>(url, { headers });
  }
}
