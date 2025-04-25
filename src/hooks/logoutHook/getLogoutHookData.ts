import { InferType, object } from 'yup';
import { decodeAndSanitizeUrl } from 'helpers/navigation/decodeAndSanitizeUrl';
import { parseQueryParams } from 'helpers/navigation/parseQueryParams';
import { validUrlSchema } from 'hooks/helpers/validUrlSchema/validUrlSchema';
import { safeWindow, sanitizeCallbackUrl } from 'lib/sdkDapp';

const schema = object({
  callbackUrl: validUrlSchema.required()
}).required();

export const getLogoutHookData: (search?: string) => {
  hookUrl: string;
  callbackUrl: string;
} | null = (search = safeWindow?.location?.search) => {
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
