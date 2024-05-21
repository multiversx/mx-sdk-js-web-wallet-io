import { parseQueryParams } from 'helpers/navigation';
import { sanitizeCallbackUrl } from 'lib/sdkDappCore';
import { decodeAndSanitizeUrl } from 'url/helpers';
import { LoginHookType, loginSchema } from 'url/helpers/login';

export const getLoginHookData = (search: string) => {
  if (!search) {
    return null;
  }

  const hook = parseQueryParams(search) as LoginHookType;

  try {
    loginSchema.validateSync(hook, { strict: true });
    let callbackUrl = decodeAndSanitizeUrl(hook.callbackUrl);
    callbackUrl = sanitizeCallbackUrl(callbackUrl);

    return {
      ...hook,
      hookUrl: search,
      callbackUrl
    };
  } catch ({ errors }: any) {
    console.error('hook format errors: ', errors);
  }

  return null;
};
