import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { firstValueFrom } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { SignInResponse } from '@/app/api/models/signInResponse';
import { User } from '@/app/api/models/user';
import { SignInService } from '@/app/api/signInService/sign-in.service';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';
import { PersonalInfoService } from '@/app/profile/services/personalInfo/personal-info.service';
import { APP_PATH } from '@/app/shared/constants/routes';
import { minTrimmedLengthValidator } from '@/app/shared/validators/validators';

import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private signInService = inject(SignInService);
  private localStorageService = inject(LocalStorageService);
  private personalInfoService = inject(PersonalInfoService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public authService = inject(AuthService);

  public loginForm = this.fb.group({
    email: this.fb.control<string>('', [
      Validators.required.bind(this),
      Validators.email.bind(this),
      Validators.pattern(/^[\w\d_]+@[\w\d_]+.\w{2,7}$/).bind(this),
    ]),
    password: this.fb.control<string>('', [Validators.required.bind(this), minTrimmedLengthValidator(8).bind(this)]),
  });

  public submitForm(): void {
    if (this.loginForm.valid) {
      firstValueFrom(this.signInService.signIn(this.userData))
        .then((data: SignInResponse) => {
          const { email } = this.userData;
          this.authService.setLoginSignals(this.userData);
          this.personalInfoService.setUserInfo(email);
          this.localStorageService.saveCurrentUser(email, data.token);
          this.router.navigate([APP_PATH.DEFAULT]);
        })
        .catch((err: OverriddenHttpErrorResponse) => {
          this.loginForm.setErrors({ [err.error.reason]: true });
        });
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
