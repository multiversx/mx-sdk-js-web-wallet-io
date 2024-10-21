import { ReplyWithPostMessageType } from 'lib/sdkDappCrossWindowProvider';
import { ReplyWithRedirectType } from './replyWithRedirect';

export interface ReplyToDappType {
  callbackUrl: string;
  webwiewApp?: HTMLIFrameElement | null;
  postMessageData?: ReplyWithPostMessageType;
  transactionData?: ReplyWithRedirectType['transactionData'];
}
