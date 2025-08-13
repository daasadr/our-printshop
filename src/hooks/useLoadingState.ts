import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

interface UseLoadingStateReturn extends LoadingState {
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string | null) => void;
  retry: () => void;
  reset: () => void;
}

export function useLoadingState(initialState: Partial<LoadingState> = {}): UseLoadingStateReturn {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    retryCount: 0,
    ...initialState
  });

  const startLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
  }, []);

  const stopLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: false
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false
    }));
  }, []);

  const retry = useCallback(() => {
    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      error: null,
      isLoading: true
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      retryCount: 0
    });
  }, []);

  return {
    ...state,
    startLoading,
    stopLoading,
    setError,
    retry,
    reset
  };
}

// Hook pre async operácie s loading stavom
export function useAsyncOperation<T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  options: {
    onSuccess?: (result: R) => void;
    onError?: (error: string) => void;
    autoRetry?: boolean;
    maxRetries?: number;
  } = {}
) {
  const { onSuccess, onError, autoRetry = false, maxRetries = 3 } = options;
  const loadingState = useLoadingState();

  const execute = useCallback(async (...args: T): Promise<R | null> => {
    loadingState.startLoading();

    try {
      const result = await operation(...args);
      loadingState.stopLoading();
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      if (autoRetry && loadingState.retryCount < maxRetries) {
        loadingState.retry();
        // Automaticky opakovať po 1 sekunde
        setTimeout(() => execute(...args), 1000);
        return null;
      } else {
        loadingState.setError(errorMessage);
        onError?.(errorMessage);
        return null;
      }
    }
  }, [operation, loadingState, onSuccess, onError, autoRetry, maxRetries]);

  return {
    ...loadingState,
    execute
  };
}

// Hook pre infinite scroll loading
export function useInfiniteLoading<T>(
  loadMore: (page: number) => Promise<T[]>,
  options: {
    initialPage?: number;
    hasMore?: boolean;
    onLoadMore?: (items: T[]) => void;
  } = {}
) {
  const { initialPage = 1, hasMore: initialHasMore = true, onLoadMore } = options;
  
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [items, setItems] = useState<T[]>([]);
  
  const loadingState = useLoadingState();

  const loadMoreItems = useCallback(async () => {
    if (loadingState.isLoading || !hasMore) return;

    loadingState.startLoading();

    try {
      const newItems = await loadMore(page);
      
      if (newItems.length > 0) {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
        setHasMore(newItems.length > 0);
        onLoadMore?.(newItems);
      } else {
        setHasMore(false);
      }
      
      loadingState.stopLoading();
    } catch (error) {
      loadingState.setError(error instanceof Error ? error.message : 'Failed to load more items');
    }
  }, [loadMore, page, hasMore, loadingState, onLoadMore]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(initialHasMore);
    setItems([]);
    loadingState.reset();
  }, [initialPage, initialHasMore, loadingState]);

  return {
    items,
    page,
    hasMore,
    ...loadingState,
    loadMoreItems,
    reset
  };
}

