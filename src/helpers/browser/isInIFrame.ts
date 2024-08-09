import { safeWindow } from 'lib/sdkDappCore';

export const isInIframe = () => {
  if (!('location' in safeWindow)) {
    // no window available
    return true;
  }

  try {
    return safeWindow.self !== safeWindow.top;
  } catch (e) {
    return true;
  }
};
