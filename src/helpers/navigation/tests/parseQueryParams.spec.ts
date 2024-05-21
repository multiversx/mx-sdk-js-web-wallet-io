import { MAIN_REFERRER } from '__mocks__';
import { parseQueryParams } from '../parseQueryParams';

describe('ParseQueryParams tests', () => {
  const searchStrings: { [key: string]: any } = {
    '?address=erd1&callbackUrl=https://localhost:3001/dashboard': {
      address: 'erd1',
      callbackUrl: `${MAIN_REFERRER}dashboard`
    },
    '?txs%5B0%5D%5Bdata%5D=56e185709b0da888e3e85be2a5b0d41198a68cecc2dab85a259bbfadba14275d&txs%5B0%5D%5Bvalue%5D=12345679012345&txs%5B0%5D%5BgasLimit%5D=1234567&txs%5B0%5D%5Breceiver%5D=56e185709b0da888e3e85be2a5b0d41198a68cecc2dab85a259bbfadba14275d&txs%5B0%5D%5BgasPrice%5D=1234567&callbackUrl=https%3A%2F%2Flocalhost%3A3001%2Fdashboard':
      {
        txs: [
          {
            data: '56e185709b0da888e3e85be2a5b0d41198a68cecc2dab85a259bbfadba14275d',
            value: '12345679012345',
            gasLimit: '1234567',
            receiver:
              '56e185709b0da888e3e85be2a5b0d41198a68cecc2dab85a259bbfadba14275d',
            gasPrice: '1234567'
          }
        ],
        callbackUrl: `${MAIN_REFERRER}dashboard`
      },
    '?value=2&data=stake@1:2&callbackUrl=https%3A%2F%2Flocalhost%3A3001%2Fdashboard':
      {
        callbackUrl: `${MAIN_REFERRER}dashboard`,
        data: 'stake@1:2',
        value: '2'
      },
    '?<body onload=alert(‘something’)>;': {},
    '?param=derp"+%2B+alert("xss")+%2b+"': {}
  };
  for (let i = 0; i < Object.keys(searchStrings).length; i++) {
    const input = Object.keys(searchStrings)[i];
    const output = searchStrings[input];
    test(`parse ${input} -> ${output}`, () => {
      const result = parseQueryParams(input);
      expect(result).toStrictEqual(output);
    });
  }
});
