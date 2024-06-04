import { runValidUrlTests } from './runValidUrlTests';

jest.mock('helpers/browser/isFirefox', () => ({
  isFirefox: () => true
}));

describe('getIsValidUrl for Firefox tests', () => {
  runValidUrlTests();
});
