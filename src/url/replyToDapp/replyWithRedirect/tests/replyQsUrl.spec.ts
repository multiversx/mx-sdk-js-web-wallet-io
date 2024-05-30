import { replyQsUrl } from '../replyQsUrl';

describe('replyQsUrl tests', () => {
  const url = 'https://wallet.multiversx.com';

  test('returns callbackUrl unmodified if qsStr is empty', () => {
    expect(replyQsUrl({ callbackUrl: url, qsStr: '' })).toBe(url);
  });

  test('adds qsStr at the end', () => {
    expect(
      replyQsUrl({
        callbackUrl: url,
        qsStr: 'param1=value&param2=value'
      })
    ).toBe('https://wallet.multiversx.com/?param1=value&param2=value');
  });

  test('adds qsStr and keeps existing hash', () => {
    expect(
      replyQsUrl({
        callbackUrl: url + '#test',
        qsStr: 'param1=value&param2=value'
      })
    ).toBe('https://wallet.multiversx.com/?param1=value&param2=value#test');
  });

  test('keeps existing urlParams and adds qsStr', () => {
    expect(
      replyQsUrl({
        callbackUrl: url + '?page=1',
        qsStr: 'param1=value&param2=value'
      })
    ).toBe('https://wallet.multiversx.com/?page=1&param1=value&param2=value');
  });

  test('keeps existing hash and adds qsStr', () => {
    expect(
      replyQsUrl({
        callbackUrl: url + '?page=1#logs',
        qsStr: 'param1=value&param2=value'
      })
    ).toBe(
      'https://wallet.multiversx.com/?page=1&param1=value&param2=value#logs'
    );
  });
});
