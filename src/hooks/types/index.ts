import { InferType } from 'yup';
import { signBaseSchema } from 'hooks/helpers/sign';

export type SignBaseHookType = InferType<typeof signBaseSchema>;
