"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toCleanPath } from "@/utils/path-utils";

/**
 * Cosmetically replaces the current query-param URL with a clean path-segment URL.
 * e.g. /user?user=godeon → /user/godeon
 * Only fires when query params are present (SPA navigation landed here with query params).
 */
export function useCleanUrl(route: string, paramKeys: string[]) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasQueryParams = paramKeys.some((key) => searchParams.get(key));
    if (!hasQueryParams) return;

    const params: Record<string, string | number> = {};
    for (const key of paramKeys) {
      const value = searchParams.get(key);
      if (value) {
        params[key] = key === "year" ? Number(value) : value;
      }
    }

    const cleanPath = toCleanPath(route, params);
    window.history.replaceState(window.history.state, "", cleanPath);
  }, [route, paramKeys, searchParams]);
}
