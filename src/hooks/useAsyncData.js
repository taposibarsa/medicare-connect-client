'use client';

import { useCallback, useEffect, useState } from 'react';

export function useAsyncData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch, setData };
}
