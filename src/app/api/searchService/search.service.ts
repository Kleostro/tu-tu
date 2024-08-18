import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SearchParams, SearchResponse } from '../models/search';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private httpClient = inject(HttpClient);

  public search(inputParams: SearchParams): Observable<SearchResponse> {
    const params = this.generateHttpParams(inputParams);
    return this.httpClient.get<SearchResponse>('search', { params });
  }

  private generateHttpParams(params: SearchParams): HttpParams {
    return Object.entries(params).reduce((httpParams, [key, value]) => {
      if (typeof value === 'number') {
        return httpParams.append(key, value.toString());
      }
      return httpParams;
    }, new HttpParams());
  }
}
