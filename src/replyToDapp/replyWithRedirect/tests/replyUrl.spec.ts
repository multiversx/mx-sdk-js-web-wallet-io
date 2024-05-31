import { replyUrl } from '../replyUrl';

describe('replyToDapp tests', () => {
  const url = 'https://wallet.multiversx.com';

  test('returns callbackUrl unmodified if urlParams is empty', () => {
    expect(replyUrl({ callbackUrl: url })).toBe(
      'https://wallet.multiversx.com/'
    );
  });

  test('adds urlParams', () => {
    expect(
      replyUrl({
        callbackUrl: url,
        urlParams: { status: 'success' }
      })
    ).toBe('https://wallet.multiversx.com/?status=success');
  });

  test('adds urlParams and keeps existing hash', () => {
    expect(
      replyUrl({
        callbackUrl: url + '#test',
        urlParams: { status: 'success' }
      })
    ).toBe('https://wallet.multiversx.com/?status=success#test');
  });

  test('keeps existing urlParams', () => {
    expect(
      replyUrl({
        callbackUrl: url + '?page=1',
        urlParams: { status: 'success' }
      })
    ).toBe('https://wallet.multiversx.com/?page=1&status=success');
  });

  test('keeps existing hash', () => {
    expect(
      replyUrl({
        callbackUrl: url + '?page=1#logs',
        urlParams: { status: 'success' }
      })
    ).toBe('https://wallet.multiversx.com/?page=1&status=success#logs');
  });

  test('throws error if callbackUrl is invalid and urlParams are defined', () => {
    expect(
      replyUrl({
        callbackUrl: '',
        urlParams: { status: 'success' }
      })
    ).toBe('');
  });
});
