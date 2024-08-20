import { inject, Injectable, signal } from '@angular/core';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { Profile } from '@/app/api/models/profile';
import { ProfileService } from '@/app/api/profileService/profile.service';
import STORE_KEYS from '@/app/core/constants/store';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  private profileService = inject(ProfileService);
  private localStorageService = inject(LocalStorageService);
  private userMessageService = inject(UserMessageService);
  private modalService = inject(ModalService);

  public currentUserName$$ = signal(this.localStorageService.getValueByKey(STORE_KEYS.NAME) ?? '');
  public currentUserEmail$$ = signal(this.localStorageService.getValueByKey(STORE_KEYS.EMAIL) ?? '');

  public setUserInfo(email: string, name = ''): void {
    this.currentUserEmail$$.set(email);
    this.currentUserName$$.set(name);
  }

  public updateProfile(email: string, name: string): void {
    this.profileService.updateProfile(email, name).subscribe({
      next: (data: Profile) => {
        this.setUserInfo(data.email, data.name);
        this.localStorageService.updateCurrentUser(data.email, data.name);
        this.userMessageService.showSuccessMessage(USER_MESSAGE.PROFILE_UPDATED_SUCCESSFULLY);
      },
      error: (error: OverriddenHttpErrorResponse) => {
        this.userMessageService.showErrorMessage(error.error.message);
      },
    });
  }

  public changePassword(newPassword: string): void {
    this.profileService.updatePassword(newPassword).subscribe({
      next: () => {
        this.userMessageService.showSuccessMessage(USER_MESSAGE.PASSWORD_CHANGED_SUCCESSFULLY);
        this.modalService.closeModal();
      },
      error: (error: OverriddenHttpErrorResponse) => {
        this.userMessageService.showErrorMessage(error.error.message);
      },
    });
  }
}
