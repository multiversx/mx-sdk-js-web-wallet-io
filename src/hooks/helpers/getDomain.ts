import { isFirefox, isSafari } from 'helpers';
import { extractDomain } from './extractDomain';

let customDomain = '';

export const setCustomDomain = (domain: string) => {
  customDomain = domain;
};

export const getDomain = (urlDomain: string | null) => {
  if (customDomain) {
    const domain = customDomain;
    setCustomDomain('');
    return domain;
  }

  let domain = isFirefox() || isSafari() ? urlDomain : '';

  if (document.referrer) {
    domain = extractDomain(document.referrer).domain;
  }

  return domain;
};
