import { MandeInstance, mande } from 'mande';

// wrap mande with configuration needed to talk to our API
export const useApi = (path: string, options: object = {}): MandeInstance => {
  const config = useRuntimeConfig();
  return mande(`${config.public.baseURL}/${path}`, options);
};
