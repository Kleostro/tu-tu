import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';

import { passwordMatchValidator } from '../../../shared/validators/validators';

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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class RegisterComponent {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  public registrationForm = this.fb.group(
    {
      email: ['', [Validators.email.bind(this), Validators.required.bind(this)]],
      password: ['', [Validators.required.bind(this), Validators.minLength(8).bind(this)]],
      confirm: ['', [Validators.required.bind(this)]],
    },
    {
      validators: passwordMatchValidator.bind(this),
    },
  );

  public submitForm(): void {
    if (this.registrationForm.valid) {
      // Perform registration logic here (e.g., send data to backend)
      // console.log('submit', this.registrationForm.value);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful!' });
      this.registrationForm.reset();
    } else {
      Object.values(this.registrationForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({
            onlySelf: true,
          });
        }
      });
    }
  }
}
