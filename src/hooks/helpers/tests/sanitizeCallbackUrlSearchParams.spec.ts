import { MAIN_REFERRER, WALLET_SOURCE_ORIGIN } from '__mocks__';
import { sanitizeCallbackUrlSearchParams } from '../sanitizeSignHookCallbackUrl/sanitizeCallbackUrlSearchParams'; // Replace 'your-file' with the actual file path

describe('sanitizeCallbackUrlSearchParams', () => {
  it('should remove sdk-dapp-version query parameter', () => {
    const url = `${WALLET_SOURCE_ORIGIN}/hook/2fa?nonce%5B0%5D=194&value%5B0%5D=100000000000000000&receiver%5B0%5D=erd1qqqqqqqqqqqqqpgq7ykazrzd905zvnlr88dpfw06677lxe9w0n4suz00uh&sender%5B0%5D=erd1c26jzneqwlfcddqre05jh53lnmyj5n8925k0r7gcqkaphr23nnpss0j540&gasPrice%5B0%5D=1000000000&gasLimit%5B0%5D=4200000&data%5B0%5D=wrapEgld&chainID%5B0%5D=D&version%5B0%5D=2&options%5B0%5D=3&guardian%5B0%5D=erd136dz04trmpz2mccwh7hwxdtdsn2jne50azzgkjwhp3ah8agjch3qjw7lsg&signature%5B0%5D=cee4e7aa6cd0e0ab9bea1608b0e629eee591b17eb646f70a3d0e81839e699037d820edccf5af53dd76bbfcf3a9c2df548cb8ec9306657f035f999f8310563b0c`;
    const callbackUrl = `&callbackUrl=${MAIN_REFERRER}dashboard%3FsignSession%3D1698389899569%26sdk-dapp-version%3D2.22.5`;
    const sanitizedUrl = sanitizeCallbackUrlSearchParams(url + callbackUrl);

    // Verify that the sdk-dapp-version query parameter is removed
    expect(sanitizedUrl).not.toContain('sdk-dapp-version%3D2.22.5');
  });

  it('should remove sdk-dapp query params when in the middle successfully', () => {
    const url =
      'https://localhost:3000/dashboard?address=erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex&multisig=erd1qqqqqqqqqqqqqpgqf738mcf8f08kuwhn8dvtka5veyad2fqwu00sqnjgln&sdk-dapp-version=2.32.3&signature=4c3b22b5826e04c8952b885dade9bb296b0f17f3f2e15288a7f0b5cdc96f7d0a66bfa425d4b1a1896fef345d82534049a3bd626df0d20c61c7131a573e5aed05';
    const sanitizedUrl = sanitizeCallbackUrlSearchParams(url);

    expect(sanitizedUrl).toStrictEqual(
      'https://localhost:3000/dashboard?address=erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex&multisig=erd1qqqqqqqqqqqqqpgqf738mcf8f08kuwhn8dvtka5veyad2fqwu00sqnjgln&signature=4c3b22b5826e04c8952b885dade9bb296b0f17f3f2e15288a7f0b5cdc96f7d0a66bfa425d4b1a1896fef345d82534049a3bd626df0d20c61c7131a573e5aed05'
    );
  });

  it('should not modify the rest of the URL', () => {
    const callbackUrl = `${WALLET_SOURCE_ORIGIN}/hook/2fa?sdk-dapp-version=2.22.5&otherParam=value`;
    const sanitizedUrl = sanitizeCallbackUrlSearchParams(callbackUrl);

    expect(sanitizedUrl).toContain('otherParam=value');
    expect(sanitizedUrl).not.toContain('sdk-dapp-version=2.22.5');
  });

  it('should not modify the rest of the URL', () => {
    const callbackUrl = `${WALLET_SOURCE_ORIGIN}/hook/2fa?sdk-dapp-version=2.22.5-alpha.1&otherParam=value`;
    const sanitizedUrl = sanitizeCallbackUrlSearchParams(callbackUrl);

    expect(sanitizedUrl).toContain('otherParam=value');
    expect(sanitizedUrl).toEqual(
      `${WALLET_SOURCE_ORIGIN}/hook/2fa?otherParam=value`
    );
  });

  it('should clear the question mark', () => {
    const callbackUrl = `${WALLET_SOURCE_ORIGIN}/hook/2fa?sdk-dapp-version=2.22.5`;
    const sanitizedUrl = sanitizeCallbackUrlSearchParams(callbackUrl);
    expect(sanitizedUrl).toBe(`${WALLET_SOURCE_ORIGIN}/hook/2fa`);
  });

  it('should clear the alpha version', () => {
    const callbackUrl =
      'https://localhost:3002/hook/2fa?sdk-dapp-version=2.22.5-alpha.1';
    const sanitizedUrl = sanitizeCallbackUrlSearchParams(callbackUrl);
    expect(sanitizedUrl).toBe('https://localhost:3002/hook/2fa');
  });

  it('should handle URLs without the sdk-dapp-version query parameter', () => {
    const callbackUrl = `${WALLET_SOURCE_ORIGIN}/hook/2fa?param=value`;
    const sanitizedUrl = sanitizeCallbackUrlSearchParams(callbackUrl);

    // Verify that the URL remains the same since there's no sdk-dapp-version query parameter to remove
    expect(sanitizedUrl).toBe(callbackUrl);
  });

  it('should keep the hash in the URL', () => {
    const callbackUrl = `${WALLET_SOURCE_ORIGIN}/hook/2fa?sdk-dapp-version=2.22.5-alpha.1&otherParam=value#someHash`;
    const sanitizedUrl = sanitizeCallbackUrlSearchParams(callbackUrl);

    expect(sanitizedUrl).toEqual(
      `${WALLET_SOURCE_ORIGIN}/hook/2fa?otherParam=value#someHash`
    );
  });

  it('should sanitize the URLs correctly', () => {
    const callbackUrl =
      'https%253A%252F%252Fdevnet.template-dapp.multiversx.com?gasLimit=116500';
    const sanitizedUrl = sanitizeCallbackUrlSearchParams(callbackUrl);

    // Verify that the URL remains the same since there's no sdk-dapp-version query parameter to remove
    expect(sanitizedUrl).toBe(
      'https://devnet.template-dapp.multiversx.com/?gasLimit=116500'
    );
  });
});
