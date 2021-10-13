import useSWRInfinite from 'swr/infinite';
import { api } from '../services/api';

const getKey = (pageIndex, previousPageData, url, pageSize) => {
  if (previousPageData && !previousPageData.length) return null;

  return `${url}&limit=${pageSize}&page=${pageIndex + 1}`;
};

export function useInfiniteFetch(url, pageSize) {
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (...args) => (url ? getKey(...args, url, pageSize) : null),
    async access => {
      const response = await api.get(access);

      return [...new Set([...(response.data.items || [])])];
    }
  );

  return { data, error, mutate, size, setSize, isValidating };
}
