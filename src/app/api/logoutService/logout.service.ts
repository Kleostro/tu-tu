import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LogoutResponse } from '../models/logoutResponse';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private httpClient = inject(HttpClient);

  public logout(): Observable<LogoutResponse> {
    return this.httpClient.delete<LogoutResponse>('logout');
  }
}
