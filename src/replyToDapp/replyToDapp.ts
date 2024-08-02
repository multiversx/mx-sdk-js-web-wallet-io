import { ReplyWithPostMessageType } from 'lib/sdkDappUtils';
import { ReplyToDappType } from './replyToDapp.types';
import { replyWithPostMessage } from './replyWithPostMessage';
import { replyWithRedirect } from './replyWithRedirect';

export const replyToDapp = (
  props: ReplyToDappType,
  extensionReplyToDapp?: (props: ReplyWithPostMessageType) => void
) => {
  const { transactionData, postMessageData, callbackUrl, webwiewApp } = props;

  // transaction hook URL reply
  if (!postMessageData) {
    return replyWithRedirect({
      transactionData,
      callbackUrl
    });
  }

  if (window.opener || isInIframe()) {
    return replyWithPostMessage({
      postMessageData,
      target: window.opener ?? window.parent,
      callbackUrl
    });
  }

  if (extensionReplyToDapp) {
    return extensionReplyToDapp(postMessageData);
  }

  if (webwiewApp) {
    return replyWithPostMessage({ postMessageData, target: webwiewApp });
  }

  // URL reply
  replyWithRedirect({
    data: postMessageData,
    callbackUrl
  });
};
