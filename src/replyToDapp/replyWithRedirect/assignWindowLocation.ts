import { safeWindow } from 'lib/sdkDappUtils';

export const assignWindowLocation = (url: string) => {
  safeWindow?.location?.assign(url);
};
