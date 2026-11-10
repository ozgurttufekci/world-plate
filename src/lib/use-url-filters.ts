"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { parseFilters, withFilters, type Filters } from "@/lib/filters";

/**
 * Filters kept in the URL query string, so a filtered view can be shared.
 * Uses useSearchParams, so the calling component must sit inside <Suspense>.
 */
export function useUrlFilters(): [Filters, (next: Filters) => void] {
  const query = useSearchParams().toString();
  const filters = useMemo(() => parseFilters(new URLSearchParams(query)), [query]);

  const setFilters = useCallback((next: Filters) => {
    // Next.js picks up replaceState, so useSearchParams re-renders without a navigation.
    window.history.replaceState(null, "", withFilters(window.location.pathname, next));
  }, []);

  return [filters, setFilters];
}
