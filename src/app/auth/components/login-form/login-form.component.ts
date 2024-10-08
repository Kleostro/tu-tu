import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { User } from '@/app/api/models/user';
import { APP_ROUTE } from '@/app/shared/constants/routes';
import { PASSWORD_MIN_LENGTH, REGEX } from '@/app/shared/validators/constants/constants';
import { minTrimmedLengthValidator } from '@/app/shared/validators/validators';

import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);

  public authService = inject(AuthService);

  public loginForm = this.fb.group({
    email: this.fb.control<string>('', [
      Validators.required.bind(this),
      Validators.email.bind(this),
      Validators.pattern(REGEX).bind(this),
    ]),
    password: this.fb.control<string>('', [
      Validators.required.bind(this),
      minTrimmedLengthValidator(PASSWORD_MIN_LENGTH).bind(this),
    ]),
  });

  public signUpPath = APP_ROUTE.SIGN_UP;

  public submitForm(): void {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.userData, this.loginForm);
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({
            onlySelf: true,
          });
        }
      });
    }
  }

  private get userData(): User {
    return {
      email: this.loginForm.controls.email.value ?? '',
      password: this.loginForm.controls.password.value ?? '',
    };
  }
}
