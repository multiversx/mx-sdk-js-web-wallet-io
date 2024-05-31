import { object, InferType, string } from 'yup';
import { validUrlSchema } from './validUrlSchema';

export const signMessageSchema = object({
  message: string().required(),
  callbackUrl: validUrlSchema.required()
}).required();

export type SignMessageHookType = InferType<typeof signMessageSchema>;
