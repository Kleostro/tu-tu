import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirm');
  return password && confirm && password.value === confirm.value ? null : { passwordMismatch: true };
};

// export function minTrimmedLengthValidator(minLength: number): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const value = control.value as string | null;
//     if (value !== null && value.trim().length < minLength) {
//       return { minTrimmedLength: { requiredLength: minLength, actualLength: value.trim().length } };
//     }
//     return null;
//   };
// }

// export function minTrimmedLengthValidator(minLength: number): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const value = control.value;
//     if (typeof value === 'string' && value.trim().length < minLength) {
//       return { minTrimmedLength: { requiredLength: minLength, actualLength: value.trim().length } };
//     }
//     return null;
//   };
// }

export function minTrimmedLengthValidator(minLength: number): ValidatorFn {
  return ({ value }: AbstractControl): ValidationErrors | null => {
    if (typeof value === 'string' && value.trim().length < minLength) {
      return { minTrimmedLength: { requiredLength: minLength, actualLength: value.trim().length } };
    }
    return null;
  };
}
