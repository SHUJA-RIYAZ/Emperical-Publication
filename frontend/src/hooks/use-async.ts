"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Runs an async service function and tracks loading/error state.
 * `fn` should be memoised (or stable) — pass deps to re-run on change.
 * Designed so swapping mock services for real HTTP calls needs no UI changes.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: readonly unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const requestIdRef = useRef(0);

  const execute = useCallback(() => {
    const requestId = ++requestIdRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => {
        if (requestId === requestIdRef.current) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (requestId === requestIdRef.current)
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error("Something went wrong"),
          });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}
