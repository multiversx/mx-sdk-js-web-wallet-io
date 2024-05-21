import { string } from 'yup';
import { getIsValidUrl } from './getIsValidUrl';

export const validUrlSchema = string().test(function (value) {
  const token: string | undefined = this.parent?.token;

  if (value) {
    try {
      const isValidUrl = getIsValidUrl({ value, token });
      return isValidUrl;
    } catch (e) {
      return false;
    }
  }
  return true;
});
