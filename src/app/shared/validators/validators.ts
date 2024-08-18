import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirm');
  return password && confirm && password.value === confirm.value ? null : { passwordMismatch: true };
};

export function minTrimmedLengthValidator(minLength: number): ValidatorFn {
  return ({ value }: AbstractControl): ValidationErrors | null => {
    if (typeof value === 'string' && value.trim().length < minLength) {
      return { minTrimmedLength: { requiredLength: minLength, actualLength: value.trim().length } };
    }
    return null;
  };
}
