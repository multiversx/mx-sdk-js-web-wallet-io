import { ReplyWithPostMessageType } from 'lib/sdkDappUtils';
import { ReplyWithRedirectType } from './replyWithRedirect';

export interface ReplyToDappType {
  callbackUrl: string;
  webwiewApp?: HTMLIFrameElement | null;
  postMessageData?: ReplyWithPostMessageType;
  transactionData?: ReplyWithRedirectType['transactionData'];
}
