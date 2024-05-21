import { runValidUrlTests } from './runValidUrlTests';

jest.mock('helpers/misc/isFirefox', () => ({
  isFirefox: () => true
}));

describe('getIsValidUrl for Firefox tests', () => {
  runValidUrlTests();
});
