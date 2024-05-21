import { extractDomain } from '../../helpers/extractDomain';

export function isDomainValid(url = '', allowedDomains: string[]) {
  try {
    const { domain, isDevelopment } = extractDomain(url);
    return allowedDomains.includes(String(domain)) || isDevelopment;
  } catch {
    return false;
  }
}
