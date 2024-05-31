import { parseQueryParams } from 'helpers';
import { sanitizeSignHookCallbackUrl } from 'hooks/helpers/sanitizeSignHookCallbackUrl/sanitizeSignHookCallbackUrl';
import {
  SignMessageHookType,
  signMessageSchema
} from 'hooks/helpers/signMessage';

const IS_DEVELOPMENT =
  process.env.NODE_ENV === 'development' ||
  window.location.hostname === 'localhost';

export const getSignMessageHookData: (search?: string) => {
  hookUrl: string;
  callbackUrl: string;
} | null = (search = window.location.search) => {
  const hook = parseQueryParams(search) as SignMessageHookType;

  let isValid = false;

  try {
    signMessageSchema.validateSync(hook, { strict: true });
    isValid = true;
  } catch ({ path, message }: any) {
    if (IS_DEVELOPMENT) {
      console.error('hook format errors: ', {
        [String(path)]: message
      });
    }
  }

  if (!isValid) {
    return null;
  }

  const { callbackUrl } = sanitizeSignHookCallbackUrl({
    callbackUrl: hook.callbackUrl
  });

  return {
    hookUrl: search,
    callbackUrl
  };
};
