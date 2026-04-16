const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";

type RouteParams = {
  user?: string | number;
  year?: number;
};

type ParsedRouteParams = {
  user?: string;
  year?: number;
};

type ParsedRoute = {
  route: string;
  params: ParsedRouteParams;
} | null;

/**
 * Parse a clean path-segment URL into route + params.
 * e.g. "/user/godeon" → { route: "/user", params: { user: "godeon" } }
 * e.g. "/year-in-review/godeon/2025" → { route: "/year-in-review", params: { user: "godeon", year: 2025 } }
 */
export function parseCleanPath(pathname: string): ParsedRoute {
  // Strip basePath prefix
  const path = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;

  const segments = path.split("/").filter(Boolean);

  if (segments[0] === "user" && segments[1]) {
    return { route: "/user", params: { user: segments[1] } };
  }

  if (segments[0] === "year-in-review" && segments[1]) {
    const year = segments[2] ? Number(segments[2]) : undefined;
    return {
      route: "/year-in-review",
      params: {
        user: segments[1],
        ...(year && !Number.isNaN(year) ? { year } : {}),
      },
    };
  }

  return null;
}

/**
 * Build a clean path-segment URL.
 * e.g. toCleanPath("/user", { user: "godeon" }) → "/gotstats/user/godeon"
 */
export function toCleanPath(route: string, params: RouteParams): string {
  if (route === "/user" && params.user) {
    return `${basePath}/user/${params.user}`;
  }
  if (route === "/year-in-review" && params.user) {
    const yearSuffix = params.year != null ? `/${params.year}` : "";
    return `${basePath}/year-in-review/${params.user}${yearSuffix}`;
  }
  return `${basePath}${route}`;
}

/**
 * Build a query-param URL for internal Next.js SPA navigation.
 * e.g. toQueryUrl("/user", { user: "godeon" }) → "/user?user=godeon"
 */
export function toQueryUrl(route: string, params: RouteParams): string {
  if (route === "/user" && params.user) {
    return `/user?user=${params.user}`;
  }
  if (route === "/year-in-review" && params.user) {
    const yearParam = params.year != null ? `&year=${params.year}` : "";
    return `/year-in-review?user=${params.user}${yearParam}`;
  }
  return route;
}
