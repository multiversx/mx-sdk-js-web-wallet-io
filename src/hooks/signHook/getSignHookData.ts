import { InferType } from 'yup';
import { parseQueryParams } from 'helpers';
import { parseSignUrl, signBaseSchema, signTxSchema } from 'hooks/helpers/sign';
import { IS_DEVELOPMENT, IS_TEST } from 'constants/index';
import { SignBaseHookType } from 'hooks/types';
import { sanitizeSignHookCallbackUrl } from 'hooks/helpers/sanitizeSignHookCallbackUrl/sanitizeSignHookCallbackUrl';

const shouldLogErrors = IS_DEVELOPMENT || IS_TEST;

export const getSignHookData =
  (schema: ReturnType<typeof signTxSchema>) =>
  (search = window.location.search) => {
    const hook: SignBaseHookType = parseQueryParams(search) as any;
    const signHookData = parseSignUrl(search);

    let isValid = false;

    try {
      signBaseSchema.validateSync(hook, { strict: true });
      let valid = true;

      signHookData.txs.forEach((tx) => {
        try {
          schema.validateSync(tx, { strict: true });
        } catch ({ path, message }: any) {
          if (shouldLogErrors) {
            console.error('hook tx format errors: ', {
              [String(path)]: message
            });
          }
          valid = false;
        }
      });

      isValid = valid;
    } catch ({ path, message }: any) {
      if (shouldLogErrors) {
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
