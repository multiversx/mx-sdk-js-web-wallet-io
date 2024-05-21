import { string } from 'yup';
import { isFirefox, isSafari } from 'helpers';
import { decodeAndSanitizeUrl } from '../decodeAndSanitizeUrl';
import { extractDomain } from '../extractDomain';
import { getNativeAuthTokenDomain } from '../getNativeAuthTokenDomain';

export const getIsValidUrl = ({
  value,
  token
}: {
  value: string;
  token?: string;
}): boolean => {
  if (value == '') {
    return true;
  }

  const url = decodeAndSanitizeUrl(value);
  let validUrl: boolean;

  try {
    validUrl = Boolean(new URL(url));
  } catch {
    validUrl = false;
  }

  const { domain: urlDomain } = extractDomain(url);
  let comparedDomain = isFirefox() || isSafari() ? urlDomain : '';

  if (document.referrer) {
    comparedDomain = extractDomain(document.referrer).domain;
  }

  // use nativeAuthOrigin if defined. If not, fallback on comparedDomain
  const nativeAuthTokenDomain = getNativeAuthTokenDomain({
    token,
    fallbackDomain: comparedDomain
  });

  const sameDomainAsReferrer =
    comparedDomain === urlDomain && comparedDomain === nativeAuthTokenDomain;

  const isTestEnvironment = urlDomain?.endsWith('.localhost');

  // allow local debugging
  if (isTestEnvironment) {
    return true;
  }

  // allow VsCode or chromeExtension
  if (
    url.startsWith('vscode://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('moz-extension://')
  ) {
    return true;
  }

  // allow only valid domains
  const isValid = url.startsWith('https://') || url.startsWith('http://');
  if (!isValid) {
    return false;
  }

  // allow only valid Urls
  try {
    const urlValidationSchema = string().url();
    urlValidationSchema.validateSync(url);
  } catch (err) {
    return false;
  }

  return validUrl && sameDomainAsReferrer;
};
