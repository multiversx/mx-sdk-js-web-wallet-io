import { decodeAndSanitizeUrl, parseQueryParams } from 'helpers/navigation';
import { sanitizeCallbackUrl } from 'lib/sdkDappCore';
import { LoginHookType, loginSchema } from 'hooks/helpers/login';

export const getLoginHookData: (search: string) => {
  hookUrl: string;
  callbackUrl: string;
  token?: string;
} | null = (search) => {
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
    console.error('login hook format errors: ', errors);
  }

  return null;
};
