import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ADMIN_CREDENTIALS } from '@/app/admin/constants/adminCredentials';
import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { User } from '@/app/api/models/user';
import STORE_KEYS from '@/app/core/constants/store';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';
import { APP_ROUTE } from '@/app/shared/constants/routes';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { SignUpService } from '../../../api/signUpService/sign-up.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private signUpService = inject(SignUpService);
  private router = inject(Router);
  private userMessageService = inject(UserMessageService);
  private localStorageService = inject(LocalStorageService);

  public isRegistrationSuccess$$ = signal(false);
  public errorMessage$$ = signal<string>('');
  public isLoggedIn$$ = signal(this.localStorageService.getValueByKey(STORE_KEYS.TOKEN) !== null);
  public isAdmin$$ = signal(this.localStorageService.getValueByKey(STORE_KEYS.EMAIL) === ADMIN_CREDENTIALS.email);

  private subscription: Subscription | null = null;

  public registerUser(user: User): void {
    this.subscription = this.signUpService.signUp(user).subscribe({
      next: () => {
        this.isRegistrationSuccess$$.set(true);
        this.errorMessage$$.set('');
        this.router.navigate([APP_ROUTE.SIGN_IN]);
        this.userMessageService.showSuccessMessage(USER_MESSAGE.REGISTRATION_SUCCESSFUL);
      },
      error: (err: OverriddenHttpErrorResponse) => {
        this.isRegistrationSuccess$$.set(false);
        this.errorMessage$$.set(err.error.reason);
        this.userMessageService.showErrorMessage(USER_MESSAGE.REGISTRATION_ERROR);
      },
    });
  }

  public setLoginSignals(userData: User): void {
    this.isLoggedIn$$.set(true);
    if (userData.email === ADMIN_CREDENTIALS.email) {
      this.isAdmin$$.set(true);
    }
  }

  public setLogoutSignals(): void {
    this.isLoggedIn$$.set(false);
    this.isAdmin$$.set(false);
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
