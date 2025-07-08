import isString from 'lodash.isstring';
import { extractDomain } from './extractDomain';
import { addHttpsToUrl } from 'helpers/navigation/addHttpsToUrl/addHttpsToUrl';
import { decodeLoginToken } from 'lib/sdkDapp';

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
