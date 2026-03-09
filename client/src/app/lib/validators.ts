import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const minWords = (min: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const words = control.value.trim().split(/\s+/).length;
    return words >= min ? null : { minWords: { required: min, actual: words } };
  };
};

export const salaryRangeValidator = (control: AbstractControl): ValidationErrors | null => {
  const salaryFrom = control.get('salaryFrom')?.value;
  const salaryTo = control.get('salaryTo')?.value;

  if (!salaryFrom || !salaryTo) return null;

  if (salaryFrom > salaryTo) return { invalidSalary: true };

  return null;
};

export const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const repeatPassword = control.get('repeatPassword')?.value;

  if (password && repeatPassword && password !== repeatPassword) {
    return { passwordMismatch: true };
  }

  return null;
};

export const phoneNumberValidator = (control: AbstractControl): ValidationErrors | null => {
  const phoneNumber = control.value;

  if (!phoneNumber) {
    return null;
  }

  const phoneRegex = /^\+?[1-9]\d{7,14}$/;

  const valid = phoneRegex.test(phoneNumber);

  return valid ? null : { invalidPhoneNumber: true };
};

export const dateRangeValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const start = group.get('startedAt')?.value;
  const end = group.get('endedAt')?.value;

  if (!end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);

  return startDate > endDate ? { dateRangeInvalid: true } : null;
};
