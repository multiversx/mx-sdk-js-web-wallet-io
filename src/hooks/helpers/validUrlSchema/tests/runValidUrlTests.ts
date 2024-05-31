import { getIsValidUrl } from '../getIsValidUrl';

export const runValidUrlTests = (referrer = '') => {
  beforeEach(() => {
    Object.defineProperty(window.document, 'referrer', {
      configurable: true,
      value: referrer
    });
  });

  const searchStrings: { [key: string]: boolean } = {
    'https://wallet.multiversx.com/': true, // allow hash
    'https://wallet.multiversx.com?search=true': true, // allow queryString
    'https%3A%2F%2Fwallet.multiversx.com%2Fdashboard': true,
    'vscode://elrond.vscode-elrond-ide': true,
    'https://www.wallet.multiversx.com/#dashboard/1': true, // no hash
    'http://localhost:3000/': true, // allow localhost
    'www.wallet.multiversx.com': false, // no http
    'wallet.multiversx.com': false, // no http
    '': true, // no url is handled by required()
    google: false // invalid format
  };

  for (let i = 0; i < Object.keys(searchStrings).length; i++) {
    const input = Object.keys(searchStrings)[i];
    const output = searchStrings[input];

    test(`validate ${input} -> ${output}`, async () => {
      const result = getIsValidUrl({ value: input });
      expect(result).toEqual(output);
    });
  }
};
