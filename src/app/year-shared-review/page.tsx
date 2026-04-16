"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { YearSharedReviewPage } from "@/components/year-in-review/year-shared-review-page";

function YearSharedReviewInner() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data") ?? undefined;

  return <YearSharedReviewPage data={data} />;
}

export default function YearInReview() {
  return (
    <Suspense>
      <YearSharedReviewInner />
    </Suspense>
  );
}
