import useSWR from 'swr';
import { api } from '../services/api';

export function useFetch(url) {
  const options = {
    shouldRetryOnError: false
  };

  const { data, error, mutate } = useSWR(
    url,
    async () => {
      const response = await api.get(url);

      return response.data;
    },
    options
  );

  return { data, error, mutate };
}
