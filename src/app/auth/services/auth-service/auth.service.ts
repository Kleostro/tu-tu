import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { firstValueFrom, Observable } from 'rxjs';

import { ADMIN_CREDENTIALS } from '@/app/admin/constants/adminCredentials';
import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { SignInResponse } from '@/app/api/models/signInResponse';
import { User } from '@/app/api/models/user';
import { SignInService } from '@/app/api/signInService/sign-in.service';
import STORE_KEYS from '@/app/core/constants/store';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';
import { RoutingService } from '@/app/core/services/routing/routing.service';
import { PersonalInfoService } from '@/app/profile/services/personalInfo/personal-info.service';
import { APP_PATH, APP_ROUTE } from '@/app/shared/constants/routes';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { isOverriddenHttpErrorResponse } from '../../../api/helpers/isOverriddenHttpErrorResponse';
import { SignUpService } from '../../../api/signUpService/sign-up.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private signUpService = inject(SignUpService);
  private signInService = inject(SignInService);
  private personalInfoService = inject(PersonalInfoService);
  private router = inject(Router);
  private routingService = inject(RoutingService);
  private userMessageService = inject(UserMessageService);
  private localStorageService = inject(LocalStorageService);
  private modalService = inject(ModalService);

  public isSignInLoading$$ = signal(false);
  public isSignUpLoading$$ = signal(false);
  public isRegistrationSuccess$$ = signal<boolean | null>(null);
  public errorMessage$$ = signal<string>('');
  public isLoggedIn$$ = signal(this.localStorageService.getValueByKey(STORE_KEYS.TOKEN) !== null);
  public isAdmin$$ = signal(this.localStorageService.getValueByKey(STORE_KEYS.EMAIL) === ADMIN_CREDENTIALS.email);

  public registerUser(user: User): Observable<object> {
    this.isSignUpLoading$$.set(true);
    return this.signUpService.signUp(user);
  }

  public handleRegisterSuccess(): void {
    this.isRegistrationSuccess$$.set(true);
    this.errorMessage$$.set('');
    this.router.navigate([APP_ROUTE.SIGN_IN]);
    this.userMessageService.showSuccessMessage(USER_MESSAGE.REGISTRATION_SUCCESSFUL);
    this.isSignUpLoading$$.set(false);
  }

  public handleRegisterError(err: OverriddenHttpErrorResponse): void {
    this.isRegistrationSuccess$$.set(false);
    this.errorMessage$$.set(err.error.reason);
    this.userMessageService.showErrorMessage(USER_MESSAGE.REGISTRATION_ERROR);
    this.isSignUpLoading$$.set(false);
  }

  public async loginUser(userData: User, loginForm: FormGroup): Promise<void> {
    this.isSignInLoading$$.set(true);
    try {
      const data: SignInResponse = await firstValueFrom(this.signInService.signIn(userData));
      const { email } = userData;
      this.setLoginSignals(userData);
      this.personalInfoService.setUserInfo(email);
      this.localStorageService.saveCurrentUser(email, data.token);
      if (!this.routingService.isDetailedPage$$()) {
        this.router.navigate([APP_PATH.DEFAULT]);
      } else {
        this.modalService.closeModal();
      }
      this.userMessageService.showSuccessMessage(USER_MESSAGE.LOGIN_SUCCESSFUL);
      this.isSignInLoading$$.set(false);
    } catch (err: unknown) {
      if (isOverriddenHttpErrorResponse(err)) {
        loginForm.setErrors({ [err.error.reason]: true });
      }
      this.userMessageService.showErrorMessage(USER_MESSAGE.LOGIN_ERROR);
      this.isSignInLoading$$.set(false);
    }
  }

  public setLoginSignals(userData: User): void {
    this.isLoggedIn$$.set(true);
    if (userData.email === ADMIN_CREDENTIALS.email) {
      this.isAdmin$$.set(true);
    } else {
      this.isAdmin$$.set(false);
    }
  }

  public setLogoutSignals(): void {
    this.isSignInLoading$$.set(false);
    this.isLoggedIn$$.set(false);
    this.isAdmin$$.set(false);
  }
}
