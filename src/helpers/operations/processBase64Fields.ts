import { IPlainTransactionObject } from '@multiversx/sdk-core';
import { decodeBase64, encodeToBase64, isStringBase64 } from 'lib/sdkDappCore';

const modifyTransaction = (
  transaction: IPlainTransactionObject,
  modifier: 'encode' | 'decode'
) => {
  const modifierFields = ['data', 'senderUsername', 'receiverUsername'];

  for (const field of modifierFields) {
    const value = transaction[field as keyof IPlainTransactionObject];
    const needsProcessing = field in transaction && value;
    if (!needsProcessing) {
      continue;
    }
    if (modifier === 'decode') {
      (transaction[field as keyof IPlainTransactionObject] as any) =
        isStringBase64(value.toString())
          ? decodeBase64(value.toString())
          : value.toString();
    }
    if (modifier === 'encode') {
      (transaction[field as keyof IPlainTransactionObject] as any) =
        isStringBase64(value.toString())
          ? value.toString()
          : encodeToBase64(value.toString());
    }
  }
  return transaction;
};

export const processBase64Fields = (transaction: IPlainTransactionObject) => {
  return {
    encode: () => modifyTransaction(transaction, 'encode'),
    decode: () => modifyTransaction(transaction, 'decode')
  };
};
