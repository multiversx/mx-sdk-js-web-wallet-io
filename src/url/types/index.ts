import { signBaseSchema } from 'url/helpers/sign';
import { InferType } from 'yup';

export type SignBaseHookType = InferType<typeof signBaseSchema>;
