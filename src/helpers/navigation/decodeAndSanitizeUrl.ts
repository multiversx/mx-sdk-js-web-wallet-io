export const decodeAndSanitizeUrl = (url: string) => {
  const decoded = decodeURIComponent(decodeURIComponent(url));
  return decoded.replace(/[^-A-Za-z0-9+&@#/%?=~_|!:,.;()]/g, '');
};
