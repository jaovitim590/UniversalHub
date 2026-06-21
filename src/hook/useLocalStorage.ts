import { useCallback, useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [key, state]);

  return [state, useCallback((updater: T | ((prev: T) => T)) => {
    setState((prev) => (typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater));
  }, [])] as const;
}