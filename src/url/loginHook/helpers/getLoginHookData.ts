import { parseQueryParams, sanitizeCallbackUrl } from "helpers";
import {
  decodeAndSanitizeUrl,
  LoginHookType,
  loginSchema,
} from "../../helpers";

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
      callbackUrl,
    };
  } catch ({ errors }) {
    console.error("hook format errors: ", errors);
  }

  return null;
};
