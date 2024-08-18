import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private PROFILE_ENDPOINT = 'profile';
  private httpClient = inject(HttpClient);

  public getProfile(): Observable<Profile> {
    return this.httpClient.get<Profile>(this.PROFILE_ENDPOINT);
  }

  public updateProfile(email: string, name: string): Observable<Profile> {
    const body = { email, name };
    return this.httpClient.put<Profile>(this.PROFILE_ENDPOINT, body);
  }

  public updatePassword(newPassword: string): Observable<object> {
    const body = { password: newPassword };
    return this.httpClient.put(`${this.PROFILE_ENDPOINT}/password`, body);
  }
}
