export const addHttpsToUrl = (url?: string) => {
  if (!url || url.includes('http')) {
    return url;
  }

  return `https://${url}`;
};
