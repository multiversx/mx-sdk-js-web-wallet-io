export const IS_DEVELOPMENT =
  process.env.NODE_ENV === 'development' ||
  window.location.hostname === 'localhost';

export const IS_TEST = process.env.NODE_ENV === 'test';
