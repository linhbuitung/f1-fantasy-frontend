import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const AllowedPasswordCharacters = /^[a-zA-Z0-9!@#$%^&*?]+$/;

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const errors: ValidationErrors = {};

    if (!AllowedPasswordCharacters.test(value)) {
      errors["invalidPassword"] = true;
    }
    if (!/[A-Z]/.test(value)) {
      errors["noUppercase"] = true;
    }
    if (!/\d/.test(value)) {
      errors["noDigit"] = true;
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      errors["noNonAlphanumeric"] = true;
    }
    return Object.keys(errors).length ? errors : null;
  };
}
