import isString from 'lodash/isString';
import { extractDomain } from './extractDomain';
import { addHttpsToUrl } from 'helpers/navigation/addHttpsToUrl/addHttpsToUrl';
import { decodeLoginToken } from 'lib/sdkDappCore';

export const getNativeAuthTokenDomain = ({
  token,
  fallbackDomain
}: {
  token?: string;
  fallbackDomain: string | null;
}) => {
  if (!token || !isString(token)) {
    return fallbackDomain;
  }

  const decodedNativeAuthToken = decodeLoginToken(token);

  if (!decodedNativeAuthToken) {
    return fallbackDomain;
  }

  const origin = addHttpsToUrl(decodedNativeAuthToken.origin);
  const nativeAuthTokenDomain = extractDomain(origin).domain;

  return nativeAuthTokenDomain;
};
