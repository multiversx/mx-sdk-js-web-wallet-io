import { decodeAndSanitizeUrl, parseQueryParams } from 'helpers/navigation';
import { sanitizeCallbackUrl } from 'lib/sdkDappCore';
import { validUrlSchema } from 'hooks/helpers';
import { InferType, object } from 'yup';

const schema = object({
  callbackUrl: validUrlSchema.required()
}).required();

export const getLogoutHookData: (search?: string) => {
  hookUrl: string;
  callbackUrl: string;
} | null = (search = window.location.search) => {
  if (!search) {
    return null;
  }

  const hook = parseQueryParams(search) as InferType<typeof schema>;

  try {
    schema.validateSync(hook, { strict: true });
    let callbackUrl = decodeAndSanitizeUrl(hook.callbackUrl);
    callbackUrl = sanitizeCallbackUrl(callbackUrl);

    return {
      hookUrl: search,
      callbackUrl
    };
  } catch ({ errors }: any) {
    console.error('logout hook format errors: ', errors);
  }

  return null;
};
