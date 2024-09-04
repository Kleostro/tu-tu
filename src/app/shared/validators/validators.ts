import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

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

export const atLeastOneConnectionValidator = (control: AbstractControl): ValidationErrors | null => {
  if (control instanceof FormArray) {
    return control.controls.some((group) => {
      if (group instanceof FormGroup) {
        return group.controls['connection'].value;
      }
      return false;
    })
      ? null
      : { atLeastOne: true };
  }
  return { atLeastOne: true };
};
