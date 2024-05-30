import omit from 'lodash/omit';
import { array, InferType, lazy, mixed, object, string } from 'yup';
import { transactionFields, TransactionFieldsType } from './transaction';
import { validUrlSchema } from './validUrlSchema';
import { isNftOrMultiEsdtTx, parseQueryParams } from 'helpers';
import { HookSearchParamsEnum } from 'types';
import { stringIsInteger } from 'lib/sdkDappCore';

const maxTransactions = window.opener ? 50 : 5;

const validString = mixed().test(
  'string',
  'Must be string',
  (text) => typeof text === 'string'
);

const validArray = array()
  .of(string())
  .required()
  .min(1, 'At least one value')
  .max(maxTransactions, `Maximum ${maxTransactions} values`);

export const arrayOrString = lazy((value) =>
  typeof value === 'string' ? validString : validArray
);

const nullableArrayOrString = lazy((value) => {
  switch (true) {
    case value === undefined:
      return mixed().notRequired();
    case typeof value === 'string':
      return validString;
    default:
      return validArray;
  }
});

export const signBaseSchema = object({
  data: nullableArrayOrString,
  token: nullableArrayOrString,
  chainId: nullableArrayOrString,
  sender: nullableArrayOrString,
  senderUsername: nullableArrayOrString,
  receiverUsername: nullableArrayOrString,
  gasLimit: arrayOrString,
  guardian: nullableArrayOrString,
  guardianSignature: nullableArrayOrString,
  gasPrice: arrayOrString,
  receiver: mixed().test(
    'sameNumberOfValues',
    'All transactions must have equal receiver field values',
    function (value) {
      const { data } = this.parent;

      if (typeof data === 'string' && isNftOrMultiEsdtTx(data)) {
        return true;
      }

      try {
        arrayOrString.validateSync(value);
        return true;
      } catch {
        return false;
      }
    }
  ),
  value: mixed().test(
    'sameNumberOfValues',
    'All transactions must have equal value field values',
    function (value) {
      const { data } = this.parent;

      if (typeof data === 'string' && isNftOrMultiEsdtTx(data)) {
        return true;
      }

      try {
        arrayOrString.validateSync(value);
        return true;
      } catch {
        return false;
      }
    }
  ),
  nonce: arrayOrString,
  callbackUrl: validUrlSchema
    .required()
    .test(
      'sameNumberOfValues',
      'All transactions must have equal array values',
      function () {
        const fields = omit(this.parent, ['modal', 'callbackUrl']);

        const allValues = Object.values(fields);
        const allArrays = allValues.every((value) => Array.isArray(value));
        if (allArrays) {
          const maxLengh = Math.max(...allValues.map((arr: any) => arr.length));
          return allValues.every((arr: any) => arr.length === maxLengh);
        }
        return true;
      }
    )
    .test(
      'differentDataTypes',
      'Values must be either strings or arrays',
      function () {
        const fields = omit(this.parent, ['modal', 'callbackUrl']);
        const allValues = Object.values(fields);
        const someArrays = allValues.some((value) => Array.isArray(value));
        const someStrings = allValues.some(
          (value) => typeof value === 'string'
        );

        return !(someArrays && someStrings);
      }
    ),
  [HookSearchParamsEnum.executeAfterSign]: string(),
  // TODO: maybe remove?
  postMessage: string().test(
    'mustBeTrue',
    'If set, postMessage param must be true',
    function (postMessage) {
      if (postMessage) {
        return postMessage === 'true';
      }
      return true;
    }
  )
}).required();

export const signTxSchema = ({
  isMainnet,
  hookWhitelist,
  chainId,
  isSignHook
}: TransactionFieldsType & {
  chainId: string;
}) => {
  const txFields = transactionFields({
    isMainnet,
    hookWhitelist,
    isSignHook
  });

  return object({
    ...txFields,
    nonce: string()
      .required()
      .test('validInteger', 'Nonce invaild number', (value) => {
        if (value != null) {
          return stringIsInteger(value);
        }
        return true;
      }),
    chainID: string().test('sameAsConfig', 'Invalid Chain Id', (value) => {
      if (value != null && value !== '') {
        return value === chainId;
      }
      return true;
    })
  }).required();
};

interface ParseSignUrlReturnType<T> {
  callbackUrl: string;
  executeAfterSign?: string;
  txs: T[];
}

export const parseSignUrl = <T>(search: string): ParseSignUrlReturnType<T> => {
  const hook = parseQueryParams(search) as InferType<typeof signBaseSchema>;
  const { callbackUrl, executeAfterSign, ...fields } = hook;

  const containsArrays = Object.values(fields).some((entry) =>
    Array.isArray(entry)
  );

  if (containsArrays) {
    const transactions: T[] = [];
    type FieldType = keyof typeof fields;

    Object.keys(fields).forEach((key) => {
      const values: string[] = fields[key as FieldType];

      if (Array.isArray(values)) {
        values.forEach((value, i) => {
          const transaction = transactions[i];
          transactions[i] = {
            ...(transaction ? { ...transaction } : {}),
            [key]: `${value}`
          } as T;
        });
      }
    });

    const parsedUrl: ParseSignUrlReturnType<T> = {
      callbackUrl: callbackUrl || '',
      txs: transactions
    };

    if (executeAfterSign) {
      parsedUrl.executeAfterSign = executeAfterSign;
    }

    return parsedUrl;
  } else {
    const txs = (Object.keys(fields).length > 0 ? [{ ...fields }] : []) as T[];

    const parsedUrl: ParseSignUrlReturnType<T> = {
      callbackUrl: callbackUrl || '',
      txs
    };

    if (executeAfterSign) {
      parsedUrl.executeAfterSign = executeAfterSign;
    }

    return parsedUrl;
  }
};
