import { safeWindow } from 'lib/sdkDappUtils';

export const IS_DEVELOPMENT =
  process.env.NODE_ENV === 'development' ||
  safeWindow?.location?.hostname === 'localhost';

export const MAX_TRANSACTIONS = 100;

export const IS_TEST = process.env.NODE_ENV === 'test';
