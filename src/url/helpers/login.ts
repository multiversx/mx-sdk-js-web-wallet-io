import { InferType, object, string } from 'yup';
import { validUrlSchema } from './validUrlSchema';

export const loginSchema = object({
  callbackUrl: validUrlSchema.required(),
  token: string().test('validLength', 'Token must be defined', (value) =>
    value ? value.length > 0 : true
  )
}).required();

export type LoginHookType = InferType<typeof loginSchema>;
