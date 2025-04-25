import { MAX_TRANSACTIONS } from 'constants/index';
import { safeWindow } from 'lib/sdkDapp';
import qs from 'qs';

export const parseQueryParams = (query: string) => {
  if (!query?.includes('?')) {
    return {};
  }

  // Prevent inserting JavaScript code in URL
  if (/[<>()]/.test(query)) {
    return {};
  }

  try {
    new URL(query, safeWindow?.location?.origin);
    return qs.parse(query?.split('?')[1], { arrayLimit: MAX_TRANSACTIONS });
  } catch (error) {
    console.error('Error parsing query parameters:', error);
    return {};
  }
};
