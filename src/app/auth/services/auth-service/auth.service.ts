import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { User } from '@/app/api/models/user';

import { SignUpService } from '../../../api/signUpService/sign-up.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private signUpService = inject(SignUpService);
  private router = inject(Router);
  public isRegistrationSuccess$$ = signal(false);
  public errorMessage$$ = signal<string>('');
  private messageService = inject(MessageService);
  private subscription: Subscription | null = null;

  public registrateUser(user: User): void {
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

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
