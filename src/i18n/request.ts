import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';
 
export default getRequestConfig(async (params) => {
  // Static for now, we'll change this later
  const store = await cookies();
  const locale = params.locale || store.get('locale')?.value || 'en';
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});