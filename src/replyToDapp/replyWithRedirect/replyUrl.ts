import { buildUrlParams } from 'lib/sdkDapp';
import { sanitizeCallbackUrlSearchParams } from 'hooks/helpers/sanitizeSignHookCallbackUrl/sanitizeCallbackUrlSearchParams';

interface ReplyUrlType {
  callbackUrl: string;
  urlParams?: Record<string, string>;
}

export const replyUrl = ({ callbackUrl, urlParams = {} }: ReplyUrlType) => {
  let url = callbackUrl;

  if (Object.entries(urlParams).length > 0) {
    try {
      const { search, origin, pathname, protocol, hash } = new URL(callbackUrl);
      const isVscode = protocol === 'vscode:';
      const { nextUrlParams } = buildUrlParams(search, urlParams);
      url = isVscode
        ? `${callbackUrl}?${nextUrlParams}${hash}`
        : `${origin}${pathname}?${nextUrlParams}${hash}`;
    } catch (err) {
      console.error('Unable to construct URL from: ', callbackUrl, err);
      return url;
    }
  }

  const clearedSdkDappVersion = sanitizeCallbackUrlSearchParams(url);

  return clearedSdkDappVersion;
};
