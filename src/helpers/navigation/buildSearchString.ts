import { IPlainTransactionObject } from '@multiversx/sdk-core/out';

export const buildSearchString = (
  plainTransactions:
    | Record<string, number | string>[]
    | IPlainTransactionObject[] = []
) => {
  const response: Record<string, string[]> = {};

  if (!(plainTransactions.length > 0)) {
    return response;
  }

  const keys = plainTransactions
    .map((transaction) => Object.keys(transaction))
    .reduce((accumulator, current) => [...accumulator, ...current], [])
    .filter((value, index, array) => array.indexOf(value) === index);

  keys.forEach((key) => {
    response[key] = plainTransactions.map(
      (transaction: any) => transaction[key]
    );
  });

  return response;
};
