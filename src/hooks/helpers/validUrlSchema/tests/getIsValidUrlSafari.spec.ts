import { runValidUrlTests } from './runValidUrlTests';

jest.mock('helpers/browser/isSafari', () => ({
  isSafari: () => true
}));

describe('getIsValidUrl for Safari tests', () => {
  runValidUrlTests();
});
