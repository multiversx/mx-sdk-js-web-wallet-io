import axios from 'axios';

import { isDomainValid } from './isDomainValid';
import { decodeNativeAuthToken } from 'lib/sdkDappCore';

export async function validateToken({
  callbackUrl,
  token,
  extrasApi
}: {
  callbackUrl: string;
  token?: string;
  extrasApi: string;
}) {
  if (!token) {
    return false;
  }

  try {
    const decodedToken = decodeNativeAuthToken(token);
    if (decodedToken?.blockHash) {
      const { data: domains } = await axios.get<Record<string, string>>(
        `${extrasApi}/permissions/allow/domains`
      );
      const allowedDomains = Object.keys(domains);
      const domainIsValid = isDomainValid(callbackUrl, allowedDomains);
      return domainIsValid;
    }
  } catch (err) {
    console.log('Unable to validate token', err);
  }
  // token is not id.maiar.com loginToken
  return true;
}
