export const loginValidation = (userData: object) => {
  let hasError = false;

  Object.entries(userData).forEach(([_key, val]) => {
    if (!val) {
      hasError = true;
    }
  });

  return hasError;
};
type FieldValidationResult = [boolean, string];
type ValidationMessages = {
  [key: string]: string;
};
export const fieldValidation = (fieldName: string, value?: string, message?: ValidationMessages, numericCheck: boolean = false): FieldValidationResult => {
  let errorMsg = '';
  if (!value) {
    errorMsg = `${message?.pleaseEnter} ${fieldName}`;
    return [true, errorMsg];
  }
  if (numericCheck && Number.isNaN(Number(value))) {
    errorMsg = `${message?.pleaseEnterNumericValue} ${fieldName}`;
    return [true, errorMsg];
  }
  return [false, ''];
};
