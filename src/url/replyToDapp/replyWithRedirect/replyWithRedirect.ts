import qs from 'qs';

import { assignWindowLocation } from './assignWindowLocation';
import { replyQsUrl } from './replyQsUrl';
import { replyUrl } from './replyUrl';

export interface ReplyWithRedirectType {
  data?: ReplyWithPostMessageType;
  callbackUrl: string;
  transactionData?: {
    address: string;
    txHash: string;
    status: HookResponseStatusEnum;
  };
}

export const replyWithRedirect = ({
  data,
  callbackUrl,
  transactionData
}: ReplyWithRedirectType) => {
  let url = '';

  const { type, payload } = data || {};

  // URL reply
  switch (type) {
    case CrossWindowProviderResponseEnums.loginResponse: {
      if (payload?.error || !payload?.data) {
        return;
      }

      const { address, signature } = payload.data;
      const urlParams: Record<string, string> = {
        address
      };

      if (signature) {
        urlParams.signature = signature;
      }

      url = replyUrl({ callbackUrl, urlParams });
      break;
    }
    case CrossWindowProviderResponseEnums.disconnectResponse: {
      url = callbackUrl;
      break;
    }

    case CrossWindowProviderResponseEnums.cancelResponse: {
      const urlParams = {
        address: payload?.data?.address ?? '',
        status: HookResponseStatusEnum.cancelled
      };
      url = replyUrl({ callbackUrl, urlParams });
      break;
    }
    case CrossWindowProviderResponseEnums.signTransactionsResponse: {
      if (!payload?.data) {
        console.error('Unable to sign transactions: ', payload?.error);
        break;
      }
      const plainTransactionsToObject = payload?.data.map((plainTransactions) =>
        objectValuesToString(plainTransactions)
      );
      const qsStr = qs.stringify(
        {
          ...buildSearchString(plainTransactionsToObject),
          [WALLET_PROVIDER_CALLBACK_PARAM]:
            WALLET_PROVIDER_CALLBACK_PARAM_TX_SIGNED
        },
        { encode: false }
      );
      const qsUrl = replyQsUrl({ callbackUrl, qsStr });
      url = sanitizeCallbackUrlSearchParams(qsUrl);
      break;
    }
    case CrossWindowProviderResponseEnums.signMessageResponse: {
      if (!payload?.data) {
        console.error('Unable to sign message: ', payload?.error);
        break;
      }
      const urlParams: Record<string, string> = {
        status: payload?.data.status
      };

      if (payload?.data.signature) {
        urlParams.signature = payload?.data.signature;
      }

      url = replyUrl({ callbackUrl, urlParams });
      break;
    }
    default: {
      break;
    }
  }

  if (transactionData) {
    const urlParams = {
      address: transactionData.address,
      txHash: transactionData.txHash,
      status: transactionData.status
    };
    url = replyUrl({ callbackUrl, urlParams });
  }

  assignWindowLocation(url);
};
