import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Subscription, take } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { APP_ROUTE } from '@/app/shared/constants/routes';
import { PASSWORD_MIN_LENGTH } from '@/app/shared/validators/constants/constants';
import { passwordMatchValidator } from '@/app/shared/validators/validators';

import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule, RouterLink],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent implements OnDestroy {
  private subscription = new Subscription();

  private fb = inject(FormBuilder);

  public authService = inject(AuthService);

  public registrationForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required.bind(this), Validators.email.bind(this)]],
      password: ['', [Validators.required.bind(this), Validators.minLength(PASSWORD_MIN_LENGTH).bind(this)]],
      confirm: ['', [Validators.required.bind(this)]],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  public APP_ROUTE = APP_ROUTE;

  public submitForm(): void {
    if (this.registrationForm.valid) {
      this.authService.isRegistrationSuccess$$.set(null);
      this.subscription.add(
        this.authService
          .registerUser(this.registrationForm.getRawValue())
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.authService.handleRegisterSuccess();
            },
            error: (err: OverriddenHttpErrorResponse) => {
              this.authService.handleRegisterError(err);
              this.registrationForm.setErrors({ [this.authService.errorMessage$$()]: true });
            },
          }),
      );
    } else {
      this.registrationForm.markAllAsTouched();
      this.registrationForm.updateValueAndValidity();
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
