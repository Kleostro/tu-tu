import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { PersonalInfoService } from '../../services/personalInfo/personal-info.service';

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
  private personalInfoService = inject(PersonalInfoService);

  public isEditingName = signal(false);
  public isEditingEmail = signal(false);

  public userForm = this.fb.nonNullable.group({
    name: this.fb.control(this.personalInfoService.currentUserName(), [Validators.required.bind(this)]),
    email: this.fb.control(this.personalInfoService.currentUserEmail(), [
      Validators.required.bind(this),
      Validators.email.bind(this),
    ]),
  });

  public save(): void {
    if (this.userForm.valid) {
      this.isEditingName.set(false);
      this.isEditingEmail.set(false);
    }
    if (this.userForm.valid && this.userForm.dirty && this.userForm.touched) {
      try {
        const email = this.userForm.controls['email'].value;
        const { name } = this.userForm.getRawValue();

        if (typeof email === 'string' && typeof name === 'string') {
          this.personalInfoService.updateProfile(email, name);
          this.userMessageService.showSuccessMessage(USER_MESSAGE.PROFILE_UPDATED_SUCCESSFULLY);
        } else {
          this.userMessageService.showErrorMessage(USER_MESSAGE.PROFILE_UPDATED_ERROR);
        }
      } catch (error) {
        this.userMessageService.showErrorMessage(USER_MESSAGE.PROFILE_UPDATED_ERROR);
      }
    }
  }
}
