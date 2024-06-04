import qs from 'qs';

export const parseQueryParams = (query: string) => {
  if (!query?.includes('?')) {
    return {};
  }

  if (query && /^\?[A-Za-z0-9\/&@:.%?#\-\[\]_=]+$/.test(query)) {
    return qs.parse(query?.split('?')[1]);
  }

  return {};
};
