import { sanitizeCallbackUrlSearchParams } from './sanitizeCallbackUrlSearchParams';

export const sanitizeSignHookCallbackUrl = <
  T extends {
    callbackUrl: string;
  }
>(
  newHook: T
) => {
  const callbackUrl = sanitizeCallbackUrlSearchParams(newHook?.callbackUrl);
  return { ...newHook, callbackUrl };
};
