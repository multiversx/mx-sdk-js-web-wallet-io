import { addHttpsToUrl } from '../addHttpsToUrl';

describe('addHttpsToUrl test', () => {
  it('should return the url as it is when url is missing', () => {
    expect(addHttpsToUrl()).toStrictEqual(undefined);
    expect(addHttpsToUrl('')).toStrictEqual('');
  });

  it('should return the url as it is when url has http://', () => {
    expect(addHttpsToUrl('https://multiversx.com')).toStrictEqual(
      'https://multiversx.com'
    );

    expect(addHttpsToUrl('http://multiversx.com')).toStrictEqual(
      'http://multiversx.com'
    );
  });

  it('should add https:// to the url successfully', () => {
    expect(addHttpsToUrl('multiversx.com')).toStrictEqual(
      'https://multiversx.com'
    );
  });
});
