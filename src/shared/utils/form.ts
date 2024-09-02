import { FieldErrors, FieldPath, FieldValues } from 'react-hook-form';
import { get as getPath } from 'react-hook-form';

type MuiErrorInfo = {
  error: boolean;
  helperText: string;
};

export const getMuiError =
  <T extends FieldValues, P extends FieldPath<T>>(errors: FieldErrors<T>) =>
  (path: P): MuiErrorInfo => {
    const message = getPath(errors, path)?.message;
    return {
      error: Boolean(message),
      helperText: message,
    };
  };
