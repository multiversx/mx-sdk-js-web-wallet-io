import qs from 'qs';
import { MAIN_REFERRER, testAccount } from '__mocks__';
import {
  arrayOrString,
  parseSignUrl,
  signBaseSchema,
  signTxSchema
} from '../sign';

describe('arrayOrString', () => {
  test('arrayOrString min 1', async () => {
    const isValid = await arrayOrString.isValid({ value: [] });
    expect(isValid).toBe(false);
  });
  test('arrayOrString max 3', async () => {
    const isValid = await arrayOrString.isValid({
      value: ['1', '2', '3', '4']
    });
    expect(isValid).toBe(false);
  });
  test('arrayOrString object invalid', async () => {
    const isValid = await arrayOrString.isValid({ value: {} });
    expect(isValid).toBe(false);
  });
  test('arrayOrString number invalid', async () => {
    const isValid = await arrayOrString.isValid({ value: 1 });
    expect(isValid).toBe(false);
  });
});

const signObject = {
  data: [
    '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
    '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
    '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d'
  ],
  value: ['0', '0', '0'],
  gasLimit: ['150500', '150500', '150500'],
  token: ['', '', ''],
  receiver: [testAccount.address, testAccount.address, testAccount.address],
  gasPrice: ['1000000000', '1000000000', '1000000000'],
  nonce: ['1', '2', '3'],
  callbackUrl: 'http://localhost:5000/transaction'
};

describe('signTxSchema', () => {
  const schema = signTxSchema({
    hookWhitelist: [],
    isMainnet: false,
    chainId: 'D'
  });
  test('signTxSchema validates mulitple transactions', async () => {
    const { txs } = parseSignUrl(qs.stringify(signObject));

    for (const tx of txs) {
      const isValid = await schema.isValid(tx);
      expect(isValid).toBe(true);
    }
  });
  test('signTxSchema rejects different chainId', async () => {
    const search = qs.stringify({
      ...signObject,
      chainID: ['1', '1', 'D']
    });

    const { txs } = parseSignUrl('?' + search);
    let result = true;

    for (const tx of txs) {
      const isValid = await schema.isValid(tx);
      result = result && isValid;
    }

    expect(result).toBe(false);
  });
});

describe('signBaseSchema', () => {
  test('signBaseSchema validates mulitple transactions', async () => {
    const isValid = await signBaseSchema.isValid(signObject);
    expect(isValid).toBe(true);
  });

  test('signBaseSchema one argument missing', async () => {
    const isValid = await signBaseSchema.isValid({
      ...signObject,
      data: [
        '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
        '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d'
        // '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
      ]
    });

    expect(isValid).toBe(false);
  });

  test('signBaseSchema invalid extra argument', async () => {
    const isValid = await signBaseSchema.isValid({
      ...signObject,
      data: [
        '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
        '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
        '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
        '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d'
      ]
    });
    expect(isValid).toBe(false);
  });

  test('signBaseSchema one proprety missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { nonce, ...rest } = signObject;
    const isValid = await signBaseSchema.isValid({
      ...rest
    });

    expect(isValid).toBe(false);
  });

  test('signBaseSchema allow chain ID', async () => {
    const isValid = await signBaseSchema.isValid({
      ...signObject,
      chainId: ['T', 'T', 'T']
    });
    expect(isValid).toBe(true);
  });
});

describe('parseSignUrl', () => {
  test('parseSignUrl extracts single transactions', async () => {
    const search =
      '?data=56e185709%40b0da888e3e85be2a5b0d4%401198a68cecc2dab85a259bbfadb%40a14275d&value=0&gasLimit=150500&token=&receiver=erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex&gasPrice=1000000000&nonce=1';
    const callbackUrl = `&callbackUrl=${MAIN_REFERRER}transaction`;
    const result = parseSignUrl(search + callbackUrl);
    expect(result).toEqual({
      callbackUrl: `${MAIN_REFERRER}transaction`,
      txs: [
        {
          data: '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
          gasLimit: '150500',
          gasPrice: '1000000000',
          nonce: '1',
          receiver: testAccount.address,
          token: '',
          value: '0'
        }
      ]
    });
  });

  test('parseSignUrl extracts mulitple transactions', async () => {
    const search =
      '?data%5B0%5D=56e185709%40b0da888e3e85be2a5b0d4%401198a68cecc2dab85a259bbfadb%40a14275d&data%5B1%5D=56e185709%40b0da888e3e85be2a5b0d4%401198a68cecc2dab85a259bbfadb%40a14275d&data%5B2%5D=56e185709%40b0da888e3e85be2a5b0d4%401198a68cecc2dab85a259bbfadb%40a14275d&value%5B0%5D=0&value%5B1%5D=0&value%5B2%5D=0&gasLimit%5B0%5D=150500&gasLimit%5B1%5D=150500&gasLimit%5B2%5D=150500&token%5B0%5D=&token%5B1%5D=&token%5B2%5D=&receiver%5B0%5D=erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex&receiver%5B1%5D=erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex&receiver%5B2%5D=erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex&gasPrice%5B0%5D=1000000000&gasPrice%5B1%5D=1000000000&gasPrice%5B2%5D=1000000000&nonce%5B0%5D=1&nonce%5B1%5D=2&nonce%5B2%5D=3';
    const callbackUrl = `&callbackUrl=${MAIN_REFERRER}transaction`;
    const result = parseSignUrl(search + callbackUrl);
    expect(result).toEqual({
      txs: [
        {
          data: '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
          value: '0',
          gasLimit: '150500',
          token: '',
          receiver: testAccount.address,
          gasPrice: '1000000000',
          nonce: '1'
        },
        {
          data: '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
          value: '0',
          gasLimit: '150500',
          token: '',
          receiver: testAccount.address,
          gasPrice: '1000000000',
          nonce: '2'
        },
        {
          data: '56e185709@b0da888e3e85be2a5b0d4@1198a68cecc2dab85a259bbfadb@a14275d',
          value: '0',
          gasLimit: '150500',
          token: '',
          receiver: testAccount.address,
          gasPrice: '1000000000',
          nonce: '3'
        }
      ],
      callbackUrl: `${MAIN_REFERRER}transaction`
    });
  });

  test('parseSignUrl correctly extracts the executeAfterSign flag', async () => {
    const search =
      '?data=someData&value=0&gasLimit=150500&token=&receiver=someReceiver&gasPrice=1000000000&nonce=1';
    const callbackUrl = `&callbackUrl=${MAIN_REFERRER}transaction&executeAfterSign=true`;
    const result = parseSignUrl(search + callbackUrl);
    expect(result).toMatchObject({
      callbackUrl: `${MAIN_REFERRER}transaction`,
      executeAfterSign: 'true',
      txs: [
        {
          data: 'someData',
          value: '0',
          gasLimit: '150500',
          token: '',
          receiver: 'someReceiver',
          gasPrice: '1000000000',
          nonce: '1'
        }
      ]
    });
  });

  test('parseSignUrl correctly keeps hash', async () => {
    const search =
      '?data=someData&value=0&gasLimit=150500&token=&receiver=someReceiver&gasPrice=1000000000&nonce=1';
    const callbackUrl = `&callbackUrl=${MAIN_REFERRER}transaction#transactions`;
    const result = parseSignUrl(search + callbackUrl);
    expect(result).toMatchObject({
      callbackUrl: `${MAIN_REFERRER}transaction#transactions`,
      txs: [
        {
          data: 'someData',
          value: '0',
          gasLimit: '150500',
          token: '',
          receiver: 'someReceiver',
          gasPrice: '1000000000',
          nonce: '1'
        }
      ]
    });
  });

  test('parseSignUrl correctly extracts the transactions', async () => {
    const search =
      '?nonce%5B0%5D=45&nonce%5B1%5D=46&value%5B0%5D=100000000000000000&value%5B1%5D=0&receiver%5B0%5D=erd1qqqqqqqqqqqqqpgqfj3z3k4vlq7dc2928rxez0uhhlq46s6p4mtqerlxhc&receiver%5B1%5D=erd1qqqqqqqqqqqqqpgqq67uv84ma3cekpa55l4l68ajzhq8qm3u0n4s20ecvx&sender%5B0%5D=erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex&sender%5B1%5D=erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex&gasPrice%5B0%5D=1000000000&gasPrice%5B1%5D=1000000000&gasLimit%5B0%5D=4200000&gasLimit%5B1%5D=25500000&data%5B0%5D=wrapEgld&data%5B1%5D=ESDTTransfer%405745474c442d643763366262%40016345785d8a0000%4073776170546f6b656e734669786564496e707574%40555344432d386434303638%40227162&chainID%5B0%5D=D&chainID%5B1%5D=D&version%5B0%5D=2&version%5B1%5D=2&options%5B0%5D=3&options%5B1%5D=3&guardian%5B0%5D=erd1jc3k6rftrdm5cxxxf8yscmyajgc2uszwg9nvx3gg0c74q6scgmzsmjpwrc&guardian%5B1%5D=erd1jc3k6rftrdm5cxxxf8yscmyajgc2uszwg9nvx3gg0c74q6scgmzsmjpwrc&signature%5B0%5D=e5ac677d25682785a8f630064dc9e69dad9f41a8967cbe23cbbf8b85012276fb539e43d4a2b19dbd4059344c7648493d285e74ef83392d7f0d0dc86873fce902&signature%5B1%5D=4aed8c6266d1a904838464c60c26c74dc622ae4a961b2ea2e67c71919f1f42763624e923eeb43c35e6b2214d3a9263c27ad83e323d0c988f980aac410c9fee00';
    const callbackUrl = `&callbackUrl=${MAIN_REFERRER}`;
    const result = parseSignUrl(search + callbackUrl);
    expect(result).toMatchObject({
      callbackUrl: `${MAIN_REFERRER}`,
      txs: [
        {
          chainID: 'D',
          data: 'wrapEgld',
          gasLimit: '4200000',
          gasPrice: '1000000000',
          guardian:
            'erd1jc3k6rftrdm5cxxxf8yscmyajgc2uszwg9nvx3gg0c74q6scgmzsmjpwrc',
          nonce: '45',
          options: '3',
          receiver:
            'erd1qqqqqqqqqqqqqpgqfj3z3k4vlq7dc2928rxez0uhhlq46s6p4mtqerlxhc',
          sender:
            'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
          signature:
            'e5ac677d25682785a8f630064dc9e69dad9f41a8967cbe23cbbf8b85012276fb539e43d4a2b19dbd4059344c7648493d285e74ef83392d7f0d0dc86873fce902',
          value: '100000000000000000',
          version: '2'
        },
        {
          chainID: 'D',
          data: 'ESDTTransfer@5745474c442d643763366262@016345785d8a0000@73776170546f6b656e734669786564496e707574@555344432d386434303638@227162',
          gasLimit: '25500000',
          gasPrice: '1000000000',
          guardian:
            'erd1jc3k6rftrdm5cxxxf8yscmyajgc2uszwg9nvx3gg0c74q6scgmzsmjpwrc',
          nonce: '46',
          options: '3',
          receiver:
            'erd1qqqqqqqqqqqqqpgqq67uv84ma3cekpa55l4l68ajzhq8qm3u0n4s20ecvx',
          sender:
            'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
          signature:
            '4aed8c6266d1a904838464c60c26c74dc622ae4a961b2ea2e67c71919f1f42763624e923eeb43c35e6b2214d3a9263c27ad83e323d0c988f980aac410c9fee00',
          value: '0',
          version: '2'
        }
      ]
    });
  });
});
