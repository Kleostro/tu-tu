import { inject, Injectable, signal } from '@angular/core';

import { Profile } from '@/app/api/models/profile';
import { ProfileService } from '@/app/api/profileService/profile.service';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  private profileService = inject(ProfileService);
  private localStorageService = inject(LocalStorageService);

  public currentUserName = signal(this.localStorageService.getValueByKey('name') ?? '');
  public currentUserEmail = signal(this.localStorageService.getValueByKey('email') ?? '');

  public setUserInfo(email: string, name = ''): void {
    this.currentUserEmail.set(email);
    this.currentUserName.set(name);
  }

  public updateProfile(email: string, name: string): void {
    this.profileService.updateProfile(email, name).subscribe((data: Profile) => {
      this.setUserInfo(data.email, data.name);
      this.localStorageService.updateCurrentUser(data.email, data.name);
    });
  }
}
