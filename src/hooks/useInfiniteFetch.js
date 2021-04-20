import { useSWRInfinite } from 'swr';
import { api } from '../services/api';

const getKey = (pageIndex, previousPageData, url, pageSize) => {
  if (previousPageData && !previousPageData.length) return null;

  return `${url}&limit=${pageSize}&page=${pageIndex + 1}`;
};

export function useInfiniteFetch(url, pageSize) {
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (...args) => getKey(...args, url, pageSize),
    async () => {
      const response = await api.get(url);

      return response.data;
    }
  );

  return { data, error, mutate, size, setSize, isValidating };
}
