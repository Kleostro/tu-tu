import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { firstValueFrom } from 'rxjs';

import { OverriddenHttpErrorResponse } from '@/app/api/models/errorResponse';
import { User } from '@/app/api/models/user';

import { SignUpService } from '../../../api/signUpService/sign-up.service';
import { passwordMatchValidator } from '../../../shared/validators/validators';

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
  providers: [MessageService],
})
export class RegisterComponent {
  private messageService = inject(MessageService);
  private signUpService = inject(SignUpService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public registrationForm = this.fb.group(
    {
      email: this.fb.control<string>('', [Validators.required.bind(this), Validators.email.bind(this)]),
      password: this.fb.control<string>('', [Validators.required.bind(this), Validators.minLength(8).bind(this)]),
      confirm: this.fb.control<string>('', [Validators.required.bind(this)]),
    },
    {
      validators: passwordMatchValidator,
    },
  );

  public submitForm(): void {
    if (this.registrationForm.valid) {
      firstValueFrom(this.signUpService.signUp(this.userData))
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful!' });
          this.router.navigate(['/sign-in']);
          this.registrationForm.reset();
        })
        .catch((err: OverriddenHttpErrorResponse) => {
          this.registrationForm.setErrors({ [err.error.reason]: true });
        });
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
      email: this.registrationForm.controls.email.value || '',
      password: this.registrationForm.controls.password.value || '',
    };
  }
}
