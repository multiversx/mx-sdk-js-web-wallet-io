import { processBase64Fields } from 'helpers/operations/processBase64Fields';
import {
  CrossWindowProviderResponseEnums,
  ReplyWithPostMessageType
} from 'lib/sdkDappUtils';
import isUndefined from 'lodash/isUndefined';

interface BaseType {
  postMessageData: ReplyWithPostMessageType;
}

interface IframeReplyType extends BaseType {
  target: HTMLIFrameElement;
  callbackUrl?: never;
}

interface OpenerReplyType extends BaseType {
  target: Window;
  callbackUrl: string;
}

type ReplyWithPostMessageJoinedType = IframeReplyType | OpenerReplyType;

export const replyWithPostMessage = ({
  postMessageData: props,
  callbackUrl,
  target
}: ReplyWithPostMessageJoinedType): void => {
  if (isUndefined(props.payload.data)) {
    console.error('Unable to sign transaction', props.payload.error);
    return;
  }
  const data =
    props.type === CrossWindowProviderResponseEnums.signTransactionsResponse
      ? props.payload.data.map((tx) => processBase64Fields(tx).encode())
      : props.payload.data;

  const isIframe = target instanceof HTMLIFrameElement;

  if (isIframe) {
    const { contentWindow } = target;

    if (contentWindow) {
      const currentIframeHref = new URL(target.src);
      const iframeOrigin = currentIframeHref.origin;

      contentWindow.postMessage(
        {
          type: props.type,
          payload: {
            data
          }
        },
        iframeOrigin
      );
    }
    return;
  }

  const allowedResponses = [
    CrossWindowProviderResponseEnums.handshakeResponse,
    CrossWindowProviderResponseEnums.cancelResponse,
    CrossWindowProviderResponseEnums.disconnectResponse
  ];

  const origin = allowedResponses.includes(props.type)
    ? '*'
    : String(callbackUrl);

  target.postMessage(
    {
      type: props.type,
      payload: {
        data
      }
    },
    origin
  );
};
