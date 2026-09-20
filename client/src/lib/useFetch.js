import { useEffect, useState, useCallback } from 'react';
import { api } from './api.js';

// Simple data-fetching hook with loading/error/reload. `path` null = skip.
export function useFetch(path, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    if (!path) return;
    setLoading(true);
    setError(null);
    api
      .get(path)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
}
