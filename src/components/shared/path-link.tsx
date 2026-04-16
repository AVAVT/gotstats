"use client";

import { useRouter } from "next/navigation";
import { type AnchorHTMLAttributes, type MouseEvent, useCallback } from "react";
import { toCleanPath, toQueryUrl } from "@/utils/path-utils";

type PathLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  route: string;
  params: { user?: string | number; year?: number };
};

/**
 * Link that displays clean path-segment URLs (for hover/right-click/copy)
 * but navigates via query-param URLs internally for SPA routing.
 * The destination page's useCleanUrl hook then rewrites the URL cosmetically.
 */
export default function PathLink({ route, params, onClick, children, ...rest }: PathLinkProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      // Allow cmd/ctrl+click to open in new tab with the clean URL
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      e.preventDefault();
      onClick?.(e);
      router.push(toQueryUrl(route, params));
    },
    [router, route, params, onClick],
  );

  return (
    <a href={toCleanPath(route, params)} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
