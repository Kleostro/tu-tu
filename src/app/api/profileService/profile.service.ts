import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import ENDPOINTS from '../constants/constants';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private httpClient = inject(HttpClient);

  public getProfile(): Observable<Profile> {
    return this.httpClient.get<Profile>(ENDPOINTS.PROFILE);
  }

  public updateProfile(email: string, name: string): Observable<Profile> {
    const body = { email, name };
    return this.httpClient.put<Profile>(ENDPOINTS.PROFILE, body);
  }

  public updatePassword(newPassword: string): Observable<object> {
    const body = { password: newPassword };
    return this.httpClient.put(`${ENDPOINTS.PROFILE}/${ENDPOINTS.PASSWORD}`, body);
  }
}
