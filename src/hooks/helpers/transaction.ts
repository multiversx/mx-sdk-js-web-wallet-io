import { string, mixed, AnySchema, object } from 'yup';
import { validUrlSchema } from './validUrlSchema';
import { isContract, stringIsInteger } from 'lib';
import { isNftOrMultiEsdtTx } from 'helpers';

export interface TransactionFieldsType {
  isMainnet: boolean;
  hookWhitelist?: string[];
  isSignHook?: boolean;
}

export const transactionFields = ({
  isMainnet,
  hookWhitelist,
  isSignHook = false
}: TransactionFieldsType) => {
  return {
    data: mixed(),
    token: string().when(['data'], (data: string, schema: AnySchema) => {
      return schema.test(
        'notAllowed',
        'Token and data not allowed',
        (value: any) => !Boolean(value && data)
      );
    }),
    sender: string(),
    gasLimit: string().test('validInteger', 'Gas limit invaild', (value) => {
      if (value != null && value !== '') {
        return stringIsInteger(value);
      }
      return true;
    }),
    gasPrice: string().test('validFloat', 'Gas price invaild', (value) => {
      if (value != null && value !== '') {
        return stringIsInteger(value);
      }
      return true;
    }),
    receiver: string()
      .required()
      .test(
        'allowed',
        'Receiver address not allowed',
        function checkReceiver(value) {
          const data: string = this.parent.data;
          const decodedData = decodeURIComponent(data);

          if (isNftOrMultiEsdtTx(decodedData)) {
            return true;
          }

          const whitelist = hookWhitelist ?? [];

          const isNotSignHookOnMainnet = isMainnet && !isSignHook;

          return (
            !isNotSignHookOnMainnet ||
            whitelist.includes(String(value)) ||
            isContract(String(value))
          );
        }
      ),
    value: string()
      .test('required', 'Value field required', function checkReceiver(value) {
        const data: string = this.parent.data;
        const decodedData = decodeURIComponent(data);

        if (isNftOrMultiEsdtTx(decodedData)) {
          return true;
        }

        return value != null;
      })
      .test('validInteger', 'Value invaild number', (value) => {
        if (value != null) {
          return stringIsInteger(value);
        }
        return true;
      })
  };
};

export const transactionSchema = ({ isMainnet }: TransactionFieldsType) => {
  const txFields = transactionFields({ isMainnet });
  return object({
    ...txFields,
    callbackUrl: validUrlSchema.required()
  }).required();
};
