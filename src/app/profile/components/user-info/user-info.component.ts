import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';
import { REGEX } from '@/app/shared/validators/constants/constants';

import { PersonalInfoService } from '../../services/personalInfo/personal-info.service';
import { formField, FormFieldType } from './constants/constants';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {
  private fb = inject(FormBuilder);
  private userMessageService = inject(UserMessageService);
  public personalInfoService = inject(PersonalInfoService);

  public isEditingName = signal(false);
  public isEditingEmail = signal(false);

  public userForm = this.fb.nonNullable.group({
    name: this.fb.control(this.personalInfoService.currentUserName(), [Validators.required.bind(this)]),
    email: this.fb.control(this.personalInfoService.currentUserEmail(), [
      Validators.required.bind(this),
      Validators.email.bind(this),
      Validators.pattern(REGEX),
    ]),
  });

  public cancelEditingField(field: FormFieldType): void {
    this[field].set(false);
  }

  private updateProfile(email: unknown, name: unknown): void {
    try {
      if (typeof email === 'string' && typeof name === 'string') {
        this.personalInfoService.updateProfile(email, name);
      }
    } catch (error) {
      this.userMessageService.showErrorMessage(USER_MESSAGE.PROFILE_UPDATED_ERROR);
    }
  }

  public updateName(): void {
    if (this.userForm.controls['name'].valid) {
      this.cancelEditingField(formField.isEditingName);
    }
    if (this.userForm.controls['name'].valid && this.userForm.controls['name'].dirty) {
      const name = this.userForm.controls['name'].value;
      const email = this.userForm.controls['email'].valid
        ? this.userForm.controls['email'].value
        : this.personalInfoService.currentUserEmail();
      this.updateProfile(email, name);
    }
  }

  public updateEmail(): void {
    if (this.userForm.controls['email'].valid) {
      this.cancelEditingField(formField.isEditingEmail);
    }
    if (this.userForm.controls['email'].valid && this.userForm.controls['email'].dirty) {
      const email = this.userForm.controls['email'].value;
      const name = this.userForm.controls['name'].valid
        ? this.userForm.controls['name'].value
        : this.personalInfoService.currentUserName();
      this.updateProfile(email, name);
    }
  }
}
