"use client";

import { redirect, usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import YearInReviewPage from "@/components/year-in-review/year-in-review-page";
import { useCleanUrl } from "@/hooks/useCleanUrl";
import { parseCleanPath } from "@/utils/path-utils";

const PARAM_KEYS = ["user", "year"];

function YearInReviewInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useCleanUrl("/year-in-review", PARAM_KEYS);

  const parsed = parseCleanPath(pathname);
  const user = searchParams.get("user") ?? parsed?.params.user ?? "";
  const yearParam = searchParams.get("year");
  const year = yearParam ? Number(yearParam) : (parsed?.params.year ?? new Date().getFullYear() - 1);

  if (!user) redirect("/");
  if (Number.isNaN(year)) redirect("/");

  return <YearInReviewPage user={user} year={year} />;
}

export default function YearInReview() {
  return (
    <Suspense>
      <YearInReviewInner />
    </Suspense>
  );
}
