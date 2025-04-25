import { safeWindow } from 'lib/sdkDapp';

export const assignWindowLocation = (url: string) => {
  safeWindow?.location?.assign(url);
};
