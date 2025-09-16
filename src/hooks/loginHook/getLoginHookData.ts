import { sanitizeCallbackUrl } from 'lib/sdkDapp';
import { LoginHookType, loginSchema } from 'hooks/helpers/login';
import { parseQueryParams } from 'helpers/navigation/parseQueryParams';
import { decodeAndSanitizeUrl } from 'helpers/navigation/decodeAndSanitizeUrl';

export const getLoginHookData: (search: string) => {
  hookUrl: string;
  callbackUrl: string;
  token?: string;
  method?: string;
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
