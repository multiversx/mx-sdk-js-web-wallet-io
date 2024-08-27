import { safeWindow } from 'lib/sdkDappCore';
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
    return qs.parse(query?.split('?')[1]);
  } catch (error) {
    console.error('Error parsing query parameters:', error);
    return {};
  }
};
