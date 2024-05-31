interface ReplyQsUrlType {
  callbackUrl: string;
  qsStr?: string;
}

export function replyQsUrl({ callbackUrl, qsStr }: ReplyQsUrlType) {
  if (!qsStr || !callbackUrl) {
    return callbackUrl;
  }

  const { search, origin, pathname, hash } = new URL(callbackUrl);
  const newSearch = search ? `${search}&${qsStr}` : `?${qsStr}`;

  return `${origin}${pathname}${newSearch}${hash}`;
}
