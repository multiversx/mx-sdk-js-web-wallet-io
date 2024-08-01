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
    new URL(query, window.location.origin);
    return qs.parse(query?.split('?')[1]);
  } catch (error) {
    console.error('Error parsing query parameters:', error);
    return {};
  }
};
