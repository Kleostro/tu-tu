import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';

import { User } from '@/app/api/models/user';
import { APP_PATH } from '@/app/shared/constants/routes';
import { PASSWORD_MIN_LENGTH } from '@/app/shared/validators/constants/constants';

import { passwordMatchValidator } from '../../../shared/validators/validators';
import { AuthService } from '../../services/auth-service/auth.service';

export interface RegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
  confirm: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    PasswordModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public registrationForm = this.fb.group(
    {
      email: this.fb.control<string>('', [Validators.required.bind(this), Validators.email.bind(this)]),
      password: this.fb.control<string>('', [
        Validators.required.bind(this),
        Validators.minLength(PASSWORD_MIN_LENGTH).bind(this),
      ]),
      confirm: this.fb.control<string>('', [Validators.required.bind(this)]),
    },
    {
      validators: passwordMatchValidator,
    },
  );
  public signInPath = `/${APP_PATH.SIGN_IN.toLowerCase()}`;

  constructor() {
    effect(() => {
      if (!this.authService.isRegistrationSuccess$$()) {
        this.registrationForm.setErrors({ [this.authService.errorMessage$$()]: true });
      } else {
        this.registrationForm.reset();
      }
    });
  }

  public submitForm(): void {
    if (this.registrationForm.valid) {
      this.authService.registerUser(this.userData);
    } else {
      Object.values(this.registrationForm.controls).forEach((control) => {
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
      email: this.registrationForm.controls.email.value ?? '',
      password: this.registrationForm.controls.password.value ?? '',
    };
  }
}
