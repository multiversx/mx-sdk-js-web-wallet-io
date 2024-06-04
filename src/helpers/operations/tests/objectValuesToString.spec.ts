import { objectValuesToString } from '../objectValuesToString';

describe('objectValuesToString tests', () => {
  it('keeps all string values the same, and stringifies other values', () => {
    const txCommonFields = {
      chainID: 'D',
      gasLimit: 60000000,
      gasPrice: 1000000000,
      guardian:
        'erd136dz04trmpz2mccwh7hwxdtdsn2jne50azzgkjwhp3ah8agjch3qjw7lsg',
      guardianSignature:
        '1a2967bd48a3673ecb50d822ef3db3faaa8dba434d70468a89322cfb6868c8e4fb795cdcac9cb221d1531b300570abdc068872a57bb89a37263a0165b7002307',
      nonce: 51,
      options: 3,
      receiver: 'erd1...xw3',
      sender: 'erd1...xw3',
      signature:
        '3c71de9da7b63ef60d929c121c5aff64455847f130f32df88e57f1e4e0b57519f42e13d965faa2ea266392944e1e5b23c9cdb76964a4493c96def058a18ca809',
      value: '100000000000000000',
      version: 2
    };
    expect(
      objectValuesToString({ ...txCommonFields, data: undefined })
    ).toStrictEqual({
      ...txCommonFields,
      version: '2',
      nonce: '51',
      options: '3',
      gasPrice: '1000000000',
      gasLimit: '60000000'
    });
  });
});
