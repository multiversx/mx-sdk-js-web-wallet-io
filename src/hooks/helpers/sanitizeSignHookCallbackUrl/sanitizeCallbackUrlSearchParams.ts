// TODO make use of SDK_DAPP_VERSION constant from sdk-dapp on upgrade

export const sanitizeCallbackUrlSearchParams = (callbackUrl: string) => {
  const decodedUrl = decodeURIComponent(decodeURIComponent(callbackUrl));
  const url = new URL(decodedUrl);

  url.searchParams.forEach((_, key) => {
    if (key.startsWith('sdk-dapp-version')) {
      url.searchParams.delete(key);
    }
  });

  return url.toString();
};
