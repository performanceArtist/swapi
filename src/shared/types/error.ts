import { AxiosError } from 'axios';
import { ZodError } from 'zod';

export type ClientError =
  | { type: 'networkError'; error: AxiosError }
  | { type: 'validationError'; error: ZodError<any> };
