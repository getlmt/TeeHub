import { useState, useCallback, useRef } from 'react';

export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const execute = useCallback(async (...args) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args, {
        signal: abortControllerRef.current.signal,
        ...options,
      });
      setData(result);
      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    cancel,
  };
};

// Hook for handling form submissions with API calls
export const useApiForm = (apiFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await apiFunction(formData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    success,
    submit,
    reset,
  };
};

// Hook for handling paginated API calls
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async (params = {}, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : page;
      const result = await apiFunction({
        ...initialParams,
        ...params,
        page: currentPage,
      });

      if (reset) {
        setData(result.data || result);
        setPage(2);
      } else {
        setData(prev => [...prev, ...(result.data || result)]);
        setPage(prev => prev + 1);
      }

      setTotal(result.total || result.length);
      setHasMore(result.hasMore || (result.data && result.data.length > 0));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, initialParams, page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData();
    }
  }, [loading, hasMore, fetchData]);

  const refresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    fetchData({}, true);
  }, [fetchData]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setTotal(0);
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    total,
    fetchData,
    loadMore,
    refresh,
    reset,
  };
};
