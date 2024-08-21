import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import ENDPOINTS from '../constants/constants';
import { SignInResponse } from '../models/signInResponse';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  private httpClient = inject(HttpClient);

  public signIn(userData: User): Observable<SignInResponse> {
    return this.httpClient.post<SignInResponse>(ENDPOINTS.SIGN_IN, userData);
  }
}
