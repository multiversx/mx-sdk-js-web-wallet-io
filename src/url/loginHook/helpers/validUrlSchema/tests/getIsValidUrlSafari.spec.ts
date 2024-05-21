import { runValidUrlTests } from './runValidUrlTests';

jest.mock('helpers/misc/isSafari', () => ({
  isSafari: () => true
}));

describe('getIsValidUrl for Safari tests', () => {
  runValidUrlTests();
});
