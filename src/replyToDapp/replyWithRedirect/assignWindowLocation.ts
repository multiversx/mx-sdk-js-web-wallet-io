import { safeWindow } from 'lib/sdkDappCore';

export const assignWindowLocation = (url: string) => {
  safeWindow?.location?.assign(url);
};
