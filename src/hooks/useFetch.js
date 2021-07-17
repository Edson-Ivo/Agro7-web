import useSWR from 'swr';
import { api } from '../services/api';

export function useFetch(url, pdfStream = false) {
  const options = {
    shouldRetryOnError: false,
    revalidateOnFocus: false
  };

  const { data, error, mutate } = useSWR(
    url,
    async () => {
      if (!pdfStream) {
        const response = await api.get(url);

        return response.data;
      }

      const response = await api.get(url, { responseType: 'blob' });

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      return fileURL;
    },
    options
  );

  return { data, error, mutate };
}
