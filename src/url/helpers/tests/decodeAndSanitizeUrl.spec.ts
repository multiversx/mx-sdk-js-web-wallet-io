import { decodeAndSanitizeUrl } from '../decodeAndSanitizeUrl';

describe('sanitizeUrl tests', () => {
  test('validate url', () => {
    const result = decodeAndSanitizeUrl('` ` `url >>');
    expect(result).toEqual('url');
  });

  test('it should preserve all URL search params and hash', () => {
    const result = decodeAndSanitizeUrl(
      'https%253A%252F%252Fdevnet.template-dapp.multiversx.com?gasLimit=116500#hash'
    );

    expect(result).toEqual(
      'https://devnet.template-dapp.multiversx.com?gasLimit=116500#hash'
    );
  });
});
