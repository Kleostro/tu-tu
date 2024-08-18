import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private httpClient = inject(HttpClient);

  public signUp(userData: User): Observable<object> {
    return this.httpClient.post('signup', userData);
  }
}
