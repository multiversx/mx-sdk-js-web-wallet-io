import { useLocation } from 'react-router-dom';

export const useGetHookData = <
  T = {
    hookUrl: string;
    callbackUrl: string;
  } | null
>(
  getHookData: (search: string) => T
) => {
  const { search: urlQueryString } = useLocation();

  return (postMessageQueryString?: string) => {
    const search = postMessageQueryString || urlQueryString;

    if (!search) {
      return null;
    }

    return getHookData(search);
  };
};
