import { signBaseSchema } from 'hooks/helpers/sign';
import { InferType } from 'yup';

export type SignBaseHookType = InferType<typeof signBaseSchema>;
