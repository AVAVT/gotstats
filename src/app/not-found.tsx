"use client";

import { useEffect, useState } from "react";
import StatisticsPage from "@/components/statistics/statistics-page";
import YearInReviewPage from "@/components/year-in-review/year-in-review-page";
import { parseCleanPath } from "@/utils/path-utils";

export default function NotFound() {
  const [resolved, setResolved] = useState<{ route: string; params: Record<string, unknown> } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const parsed = parseCleanPath(window.location.pathname);
    setResolved(parsed);
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (resolved?.route === "/user" && resolved.params.user) {
    return <StatisticsPage user={resolved.params.user as string} />;
  }

  if (resolved?.route === "/year-in-review" && resolved.params.user) {
    const year = (resolved.params.year as number) ?? new Date().getFullYear() - 1;
    return <YearInReviewPage user={resolved.params.user as string} year={year} />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-4xl font-bold mb-4">Page not found</h2>
      <p className="text-lg text-foreground-dark">The page you're looking for doesn't exist.</p>
    </div>
  );
}
