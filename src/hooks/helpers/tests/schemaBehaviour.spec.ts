import { testAccount } from '__mocks__';
import { loginSchema } from '../login';
import { arrayOrString, signBaseSchema, signTxSchema } from '../sign';

const txSchema = signTxSchema({
  isMainnet: false,
  hookWhitelist: [],
  chainId: 'D'
});

const baseTx = {
  value: '0',
  gasLimit: '150500',
  gasPrice: '1000000000',
  nonce: '1',
  receiver: testAccount.address
};

describe('transaction token/data mutual exclusion', () => {
  test('rejects a transaction with both token and data', async () => {
    const isValid = await txSchema.isValid({
      ...baseTx,
      token: 'TKN-123456',
      data: 'someData'
    });
    expect(isValid).toBe(false);
  });

  test('allows a token when data is empty', async () => {
    const isValid = await txSchema.isValid({
      ...baseTx,
      token: 'TKN-123456',
      data: ''
    });
    expect(isValid).toBe(true);
  });

  test('allows data when token is empty', async () => {
    const isValid = await txSchema.isValid({
      ...baseTx,
      token: '',
      data: 'someData'
    });
    expect(isValid).toBe(true);
  });

  test('allows neither token nor data', async () => {
    const isValid = await txSchema.isValid({
      ...baseTx,
      token: '',
      data: ''
    });
    expect(isValid).toBe(true);
  });
});

describe('empty callbackUrl is rejected', () => {
  test('loginSchema rejects an empty callbackUrl', async () => {
    const isValid = await loginSchema.isValid({ callbackUrl: '' });
    expect(isValid).toBe(false);
  });

  test('loginSchema rejects a missing callbackUrl', async () => {
    const isValid = await loginSchema.isValid({});
    expect(isValid).toBe(false);
  });

  test('signBaseSchema rejects an empty callbackUrl', async () => {
    const isValid = await signBaseSchema.isValid({
      data: 'someData',
      value: '0',
      gasLimit: '150500',
      gasPrice: '1000000000',
      nonce: '1',
      receiver: testAccount.address,
      callbackUrl: ''
    });
    expect(isValid).toBe(false);
  });
});

describe('unknown keys still participate in the array length check', () => {
  const consistent = {
    data: ['a', 'b'],
    value: ['0', '0'],
    gasLimit: ['150500', '150500'],
    gasPrice: ['1000000000', '1000000000'],
    nonce: ['1', '2'],
    receiver: [testAccount.address, testAccount.address],
    callbackUrl: 'https://localhost:3000/'
  };

  test('accepts arrays of equal length', async () => {
    const isValid = await signBaseSchema.isValid(consistent);
    expect(isValid).toBe(true);
  });

  test('rejects an undeclared key whose array length differs', async () => {
    const isValid = await signBaseSchema.isValid({
      ...consistent,
      unknownField: ['1', '2', '3']
    });
    expect(isValid).toBe(false);
  });
});

describe('arrayOrString rejects empty arrays', () => {
  test('rejects an empty array', async () => {
    const isValid = await arrayOrString.isValid([]);
    expect(isValid).toBe(false);
  });

  test('accepts a non-empty array', async () => {
    const isValid = await arrayOrString.isValid(['1']);
    expect(isValid).toBe(true);
  });

  test('accepts a plain string', async () => {
    const isValid = await arrayOrString.isValid('1');
    expect(isValid).toBe(true);
  });
});
