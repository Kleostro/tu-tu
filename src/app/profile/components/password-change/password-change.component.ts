import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

import { ModalService } from '@/app/shared/services/modal/modal.service';
import { PASSWORD_MIN_LENGTH } from '@/app/shared/validators/constants/constants';

import { PersonalInfoService } from '../../services/personalInfo/personal-info.service';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [ButtonModule, PasswordModule, DividerModule, FloatLabelModule, ReactiveFormsModule, FormsModule],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordChangeComponent {
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  private personalInfoService = inject(PersonalInfoService);

  public newPasswordForm = this.fb.nonNullable.group({
    password: this.fb.control<string>('', [
      Validators.required.bind(this),
      Validators.minLength(PASSWORD_MIN_LENGTH).bind(this),
    ]),
  });

  public savePassword(): void {
    const newPassword = this.newPasswordForm.controls['password'].value;
    if (this.newPasswordForm.valid && newPassword) {
      this.personalInfoService.changePassword(newPassword);
    }
  }

  public cancel(): void {
    this.modalService.closeModal();
  }
}
