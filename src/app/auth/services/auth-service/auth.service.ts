import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { ADMIN_CREDENTIALS } from '@/app/admin/constants/adminCredentials';
import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { User } from '@/app/api/models/user';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';

import { SignUpService } from '../../../api/signUpService/sign-up.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private signUpService = inject(SignUpService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private localStorageService = inject(LocalStorageService);

  public isRegistrationSuccess$$ = signal(false);
  public errorMessage$$ = signal<string>('');
  public isLoggedIn$$ = signal(this.localStorageService.getValueByKey('token') !== null);
  public isAdmin$$ = signal(this.localStorageService.getValueByKey('email') === ADMIN_CREDENTIALS.email);

  private subscription: Subscription | null = null;

  public registerUser(user: User): void {
    this.subscription = this.signUpService.signUp(user).subscribe({
      next: () => {
        this.isRegistrationSuccess$$.set(true);
        this.errorMessage$$.set('');
        this.router.navigate(['/sign-in']);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful!' });
      },
      error: (err: OverriddenHttpErrorResponse) => {
        this.isRegistrationSuccess$$.set(false);
        this.errorMessage$$.set(err.error.reason);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Registration failed!' });
      },
    });
  }

  public setLoginSignals(userData: User): void {
    this.isLoggedIn$$.set(true);
    if (userData.email === ADMIN_CREDENTIALS.email && userData.password === ADMIN_CREDENTIALS.password) {
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
